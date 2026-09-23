import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate first
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { orderId, packageId, referralCode } = body;

    if (!orderId || !packageId) {
      return Response.json({ error: 'Missing orderId or packageId' }, { status: 400 });
    }

    const pkg = await base44.asServiceRole.entities.HostingPackage.get(packageId);
    if (!pkg) {
      return Response.json({ error: 'Package not found' }, { status: 404 });
    }

    let affiliate = null;
    if (referralCode) {
      const affiliates = await base44.asServiceRole.entities.Affiliate.filter({ referral_code: referralCode });
      affiliate = affiliates[0];
    }

    const useSandbox = Deno.env.get('PAYPAL_SANDBOX') === 'true';
    const clientId = Deno.env.get('PAYPAL_SANDBOX_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_SECRET');
    const baseUrl = useSandbox ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';
    const authString = btoa(`${clientId}:${clientSecret}`);

    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return Response.json({ error: 'Failed to get PayPal token' }, { status: 500 });
    }

    const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const captureData = await captureRes.json();
    if (captureData.status !== 'COMPLETED') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const amount = pkg.monthly_price;
    const affiliateId = affiliate?.id;

    // Determine commission rate: 75% if 10+ referrals, otherwise 70%
    const existingReferrals = affiliateId
      ? await base44.asServiceRole.entities.Referral.filter({ affiliate_id: affiliateId })
      : [];
    const commissionRate = existingReferrals.length >= 10 ? 0.75 : 0.70;
    const commissionAmount = affiliateId ? (amount * commissionRate) : 0;

    // Create referral record
    const referral = await base44.asServiceRole.entities.Referral.create({
      affiliate_id: affiliateId || 'admin',
      customer_email: user.email,
      customer_name: user.full_name,
      package_id: pkg.id,
      package_name: pkg.name,
      sale_amount: amount,
      commission_amount: commissionAmount,
      status: 'approved',
      billing_cycle: 'monthly',
      is_recurring: true,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      referral_source: referralCode || 'direct'
    });

    // Update affiliate stats
    if (affiliate) {
      await base44.asServiceRole.entities.Affiliate.update(affiliateId, {
        total_referrals: existingReferrals.length + 1,
        pending_balance: (affiliate.pending_balance || 0) + commissionAmount
      });
    }

    return Response.json({
      success: true,
      referral: referral,
      affiliateId: affiliateId
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
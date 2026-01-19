import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { orderId, packageId } = body;

    if (!orderId || !packageId) {
      return Response.json({ error: 'Missing orderId or packageId' }, { status: 400 });
    }

    // Get package details
    const pkg = await base44.asServiceRole.entities.HostingPackage.get(packageId);
    if (!pkg) {
      return Response.json({ error: 'Package not found' }, { status: 404 });
    }

    // Get current user (the customer)
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params for referral code
    const url = new URL(req.url);
    const referralCode = url.searchParams.get('ref');

    let affiliate = null;
    let parentAffiliate = null;

    // Find affiliate by referral code
    if (referralCode) {
      const affiliates = await base44.asServiceRole.entities.Affiliate.filter({ referral_code: referralCode });
      affiliate = affiliates[0];
    }

    // Get PayPal details via order capture
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_API_SECRET');
    const authString = btoa(`${clientId}:${clientSecret}`);

    const tokenRes = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();
    const amount = pkg.monthly_price;

    // Capture the order
    const captureRes = await fetch(`https://api.paypal.com/v2/checkout/orders/${orderId}/capture`, {
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

    // Create lead if affiliate exists
    if (affiliate) {
      await base44.asServiceRole.entities.Lead.create({
        email: user.email,
        full_name: user.full_name,
        affiliate_id: affiliate.id,
        interested_package: pkg.id,
        source: 'referral_link',
        status: 'new'
      });
    }

    // Check affiliate's referral count and determine payout flow
    let payoutRecipient = 'admin'; // Default to admin
    let referralStatus = 'pending';

    if (affiliate) {
      // Count approved referrals for this affiliate
      const referrals = await base44.asServiceRole.entities.Referral.filter({
        affiliate_id: affiliate.id,
        status: 'approved'
      });

      const approvedCount = referrals.length;

      // If affiliate already has 3+ approved, they get commission
      if (approvedCount >= 3) {
        payoutRecipient = affiliate.id;
        referralStatus = 'approved';
      }

      // Check if affiliate has parent (is a sub-affiliate)
      if (affiliate.parent_affiliate_id) {
        parentAffiliate = await base44.asServiceRole.entities.Affiliate.get(affiliate.parent_affiliate_id);
      }
    }

    // Create referral record
    const referral = await base44.asServiceRole.entities.Referral.create({
      affiliate_id: affiliate?.id || 'admin',
      customer_email: user.email,
      customer_name: user.full_name,
      package_id: pkg.id,
      package_name: pkg.name,
      sale_amount: amount,
      commission_amount: payoutRecipient === 'admin' ? amount : (amount * 0.3), // Example: 30% commission
      status: referralStatus,
      billing_cycle: 'monthly',
      is_recurring: true,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      referral_source: `referral_code:${referralCode}`
    });

    // If first 3 payments going to admin, update affiliate referral count
    if (affiliate && payoutRecipient === 'admin') {
      const referralCount = await base44.asServiceRole.entities.Referral.filter({
        affiliate_id: affiliate.id
      });

      await base44.asServiceRole.entities.Affiliate.update(affiliate.id, {
        total_referrals: referralCount.length
      });

      // Check if hitting 3 referrals - activate daily payouts
      if (referralCount.length === 3) {
        await base44.asServiceRole.entities.Affiliate.update(affiliate.id, {
          daily_payout_active: true,
          status: 'active'
        });
      }
    }

    return Response.json({
      success: true,
      referral: referral,
      payoutTo: payoutRecipient,
      orderDetails: captureData
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
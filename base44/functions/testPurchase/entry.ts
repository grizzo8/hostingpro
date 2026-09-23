import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId, referralCode } = await req.json();

    // Get package
    const pkg = await base44.entities.HostingPackage.get(packageId);
    if (!pkg) {
      return Response.json({ error: 'Package not found' }, { status: 404 });
    }

    // Get affiliate by referral code
    const affiliates = await base44.entities.Affiliate.filter({ referral_code: referralCode });
    const affiliate = affiliates[0];
    if (!affiliate) {
      return Response.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    // Create test referral
    const commissionAmount = pkg.price * (affiliate.tier === 'gold' ? 0.25 : affiliate.tier === 'platinum' ? 0.35 : 0.15);
    
    await base44.asServiceRole.entities.Referral.create({
      affiliate_id: affiliate.id,
      customer_email: `test-${Date.now()}@example.com`,
      customer_name: 'Test Customer',
      package_id: pkg.id,
      package_name: pkg.name,
      sale_amount: pkg.price,
      commission_amount: commissionAmount,
      status: 'approved',
      billing_cycle: 'monthly',
      is_recurring: true
    });

    return Response.json({ success: true, message: 'Test purchase created' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
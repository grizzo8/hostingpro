import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only admin can trigger this
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    // Get all active affiliates with daily payouts enabled
    const affiliates = await base44.asServiceRole.entities.Affiliate.filter({
      daily_payout_active: true,
      status: 'active'
    });

    const payouts = [];

    for (const affiliate of affiliates) {
      // Get approved referrals for this affiliate
      const referrals = await base44.asServiceRole.entities.Referral.filter({
        affiliate_id: affiliate.id,
        status: 'approved',
        is_recurring: true
      });

      if (referrals.length === 0) continue;

      // Calculate daily payout (sum of all recurring commissions / 30 days)
      const totalMonthlyCommission = referrals.reduce((sum, ref) => sum + (ref.commission_amount || 0), 0);
      const dailyAmount = parseFloat((totalMonthlyCommission / 30).toFixed(2));

      if (dailyAmount <= 0) continue;

      // Create payout record
      const payout = await base44.asServiceRole.entities.Payout.create({
        affiliate_id: affiliate.id,
        affiliate_email: affiliate.user_email,
        paypal_email: affiliate.paypal_email,
        amount: dailyAmount,
        status: 'pending',
        notes: `Daily payout for ${new Date().toLocaleDateString()}`
      });

      payouts.push({
        affiliateId: affiliate.id,
        amount: dailyAmount,
        payoutId: payout.id
      });

      // Update pending balance
      const currentBalance = affiliate.pending_balance || 0;
      await base44.asServiceRole.entities.Affiliate.update(affiliate.id, {
        pending_balance: currentBalance + dailyAmount
      });
    }

    return Response.json({
      success: true,
      payoutsProcessed: payouts.length,
      payouts: payouts
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
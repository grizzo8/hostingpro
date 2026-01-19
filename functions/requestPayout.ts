import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { affiliateId, amount, paypalEmail } = body;

    if (!affiliateId || !amount || !paypalEmail) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < 1) {
      return Response.json({ error: 'Minimum payout is $1.00' }, { status: 400 });
    }

    // Get affiliate to verify ownership
    const affiliate = await base44.asServiceRole.entities.Affiliate.get(affiliateId);
    if (!affiliate || affiliate.user_email !== user.email) {
      return Response.json({ error: 'Not authorized' }, { status: 403 });
    }

    if (amount > affiliate.pending_balance) {
      return Response.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create payout request
    const payout = await base44.asServiceRole.entities.Payout.create({
      affiliate_id: affiliateId,
      affiliate_email: affiliate.user_email,
      paypal_email: paypalEmail,
      amount: amount,
      status: 'pending'
    });

    // Update affiliate pending balance
    const newBalance = affiliate.pending_balance - amount;
    await base44.asServiceRole.entities.Affiliate.update(affiliateId, {
      pending_balance: newBalance
    });

    return Response.json({
      success: true,
      payout: payout,
      message: 'Payout request submitted successfully'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
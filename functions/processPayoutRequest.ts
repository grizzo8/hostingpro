import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { payoutId, action } = body; // action: 'approve', 'reject', 'complete'

    if (!payoutId || !action) {
      return Response.json({ error: 'Missing payoutId or action' }, { status: 400 });
    }

    const payout = await base44.asServiceRole.entities.Payout.get(payoutId);
    if (!payout) {
      return Response.json({ error: 'Payout not found' }, { status: 404 });
    }

    let newStatus;
    if (action === 'approve') {
      newStatus = 'processing';
    } else if (action === 'reject') {
      newStatus = 'failed';
      // Restore balance to affiliate if rejecting
      const affiliate = await base44.asServiceRole.entities.Affiliate.get(payout.affiliate_id);
      await base44.asServiceRole.entities.Affiliate.update(payout.affiliate_id, {
        pending_balance: (affiliate.pending_balance || 0) + payout.amount
      });
    } else if (action === 'complete') {
      newStatus = 'completed';
    }

    // Update payout status
    const updatedPayout = await base44.asServiceRole.entities.Payout.update(payoutId, {
      status: newStatus,
      processed_at: new Date().toISOString()
    });

    return Response.json({
      success: true,
      payout: updatedPayout,
      message: `Payout ${action}d successfully`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
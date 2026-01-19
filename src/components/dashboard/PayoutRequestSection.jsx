import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Send, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';

export default function PayoutRequestSection({ affiliate, user }) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const queryClient = useQueryClient();

  const requestPayoutMutation = useMutation({
    mutationFn: async (amount) => {
      if (!affiliate?.paypal_email) {
        throw new Error('PayPal email not set');
      }
      
      const response = await base44.functions.invoke('requestPayout', {
        affiliateId: affiliate.id,
        amount: parseFloat(amount),
        paypalEmail: affiliate.paypal_email
      });
      
      return response.data;
    },
    onSuccess: () => {
      setWithdrawAmount('');
      queryClient.invalidateQueries(['affiliate', user?.email]);
    }
  });

  const pendingPayouts = affiliate?.pending_payouts || [];
  const hasProcessing = pendingPayouts.some(p => p.status === 'processing');
  const maxWithdraw = affiliate?.pending_balance || 0;

  const handleRequestPayout = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > maxWithdraw) {
      alert(`Maximum available: $${maxWithdraw.toFixed(2)}`);
      return;
    }
    if (!affiliate?.paypal_email) {
      alert('Please set your PayPal email first');
      return;
    }
    requestPayoutMutation.mutate(amount);
  };

  return (
    <div className="space-y-6">
      {/* Pending Balance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-white">${maxWithdraw.toFixed(2)}</p>
              <p className="text-gray-500 text-xs mt-2">Ready for withdrawal</p>
            </div>
            <DollarSign className="w-12 h-12 text-emerald-500/40" />
          </div>
        </GlassCard>
      </motion.div>

      {/* PayPal Email Status */}
      {!affiliate?.paypal_email ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium text-sm">PayPal Email Required</p>
            <p className="text-gray-400 text-sm mt-1">Please add your PayPal email address above to request payouts.</p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-400 font-medium text-sm">PayPal Connected</p>
            <p className="text-gray-400 text-sm mt-1">{affiliate.paypal_email}</p>
          </div>
        </div>
      )}

      {/* Payout Request Form */}
      {maxWithdraw > 0 && affiliate?.paypal_email && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6 bg-white/5">
            <h4 className="text-white font-semibold mb-4">Request Payout</h4>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Withdrawal Amount (USD)</Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="0"
                      max={maxWithdraw}
                      step="0.01"
                      disabled={requestPayoutMutation.isPending}
                      className="pl-8 bg-slate-900 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Button
                    onClick={handleRequestPayout}
                    disabled={requestPayoutMutation.isPending || !withdrawAmount || hasProcessing}
                    className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50"
                  >
                    {requestPayoutMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Max: ${maxWithdraw.toFixed(2)} • Min: $1.00
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Payout Requests History */}
      {pendingPayouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Payout Requests
            </h4>
            <div className="space-y-2">
              {pendingPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">${payout.amount?.toFixed(2)}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(payout.created_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      payout.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      payout.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      payout.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
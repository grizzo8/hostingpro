import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';

export default function PayoutHistory({ payouts, affiliate }) {
  const [showForm, setShowForm] = useState(false);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* PayPal Account */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">PayPal Email</p>
              <p className="text-lg font-semibold text-slate-900">{affiliate?.paypal_email || 'Not set'}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setShowForm(true)}
          >
            Update
          </Button>
        </div>
        <p className="text-sm text-gray-500">Daily payouts are sent to this PayPal account</p>
      </GlassCard>

      {/* Payout History */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Payout History</h3>
        {!payouts || payouts.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No payouts yet</p>
            <p className="text-gray-500 text-sm">Your first payout will appear here after you reach 3 referrals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  {getStatusIcon(payout.status)}
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">${payout.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payout.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold capitalize ${
                    payout.status === 'completed' ? 'text-green-600' :
                    payout.status === 'processing' ? 'text-amber-600' :
                    payout.status === 'pending' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {payout.status}
                  </p>
                  {payout.transaction_id && (
                    <p className="text-xs text-gray-500">ID: {payout.transaction_id.slice(0, 8)}...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
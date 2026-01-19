import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function EarningsOverview({ affiliate }) {
  const dailyPayout = affiliate?.package?.daily_payout || 0;
  const totalEarnings = affiliate?.total_earnings || 0;
  const pendingBalance = affiliate?.pending_balance || 0;
  const referralsCount = affiliate?.total_referrals || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <GlassCard className="p-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Daily Earnings */}
          <div className="border-b md:border-b-0 md:border-r border-red-200 pb-6 md:pb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Daily Earnings</p>
                <p className="text-2xl font-bold text-red-600">${dailyPayout.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">When you have 3 referrals</p>
          </div>

          {/* Total Earnings */}
          <div className="border-b md:border-b-0 md:border-r border-red-200 pb-6 md:pb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-slate-900">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">All-time earnings</p>
          </div>

          {/* Pending Balance */}
          <div className="border-b md:border-b-0 md:border-r border-red-200 pb-6 md:pb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pending Payout</p>
                <p className="text-2xl font-bold text-amber-600">${pendingBalance.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Ready for withdrawal</p>
          </div>

          {/* Referrals Status */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Referrals</p>
                <p className="text-2xl font-bold text-slate-900">{referralsCount}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Total sign-ups</p>
          </div>
        </div>
      </GlassCard>

      {/* Commission Breakdown */}
      <GlassCard className="p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Commission Breakdown</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-gray-600 text-sm mb-2">1st Sale</p>
            <p className="text-3xl font-bold text-red-600">100%</p>
            <p className="text-xs text-gray-500 mt-1">All yours</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">2nd Sale</p>
            <p className="text-3xl font-bold text-gray-600">0%</p>
            <p className="text-xs text-gray-500 mt-1">Goes to admin</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-gray-600 text-sm mb-2">3rd+ Sales</p>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-xs text-gray-500 mt-1">Daily payouts</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
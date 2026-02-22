import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function EarningsOverview({ affiliate }) {
  const dailyPayout = affiliate?.package?.daily_payout || 0;
  const totalEarnings = affiliate?.total_earnings || 0;
  const pendingBalance = affiliate?.pending_balance || 0;
  const referralsCount = affiliate?.total_referrals || 0;
  const commissionRate = referralsCount >= 10 ? 75 : 70;

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
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Your Commission Rate</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-gray-600 text-sm mb-2">Referrals 1–9</p>
            <p className="text-3xl font-bold text-green-600">70%</p>
            <p className="text-xs text-gray-500 mt-1">Of every sale, paid daily</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-600 text-sm">10+ Referrals</p>
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">ELITE</span>
            </div>
            <p className="text-3xl font-bold text-orange-500">75%</p>
            <p className="text-xs text-gray-500 mt-1">Auto-upgraded, forever</p>
          </div>
        </div>
        {referralsCount >= 10 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
            <p className="text-orange-700 font-semibold text-sm">🏆 Elite Status Unlocked! You're earning 75% commission.</p>
          </div>
        )}
        {referralsCount < 10 && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-600 text-sm">{10 - referralsCount} more referral{10 - referralsCount !== 1 ? 's' : ''} to unlock Elite 75% commission</p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Target } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function ReferralStats({ referrals, affiliate }) {
  const directReferrals = referrals?.filter(r => r.level === 1 || !r.level)?.length || 0;
  const indirectReferrals = referrals?.filter(r => r.level > 1)?.length || 0;
  const approvedReferrals = referrals?.filter(r => r.status === 'approved')?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Direct Referrals</p>
              <p className="text-3xl font-bold text-slate-900">{directReferrals}</p>
              <p className="text-xs text-gray-500 mt-1">Your sign-ups</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Indirect Referrals</p>
              <p className="text-3xl font-bold text-slate-900">{indirectReferrals}</p>
              <p className="text-xs text-gray-500 mt-1">Their sign-ups</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Approved Referrals</p>
              <p className="text-3xl font-bold text-slate-900">{approvedReferrals}</p>
              <p className="text-xs text-gray-500 mt-1">Earning status</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Referral Progress */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Path to Daily Earnings</h3>
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex flex-col items-center gap-2 flex-1 ${step <= directReferrals ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  step <= directReferrals ? 'bg-red-600' : 'bg-gray-300'
                }`}>
                  {step}
                </div>
                <p className="text-sm text-gray-600 text-center">Referral {step}</p>
              </div>
              {step < 3 && (
                <div className={`h-1 flex-1 mb-6 ${step < directReferrals ? 'bg-red-600' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        {directReferrals >= 3 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">✓ You're earning daily payouts!</p>
          </div>
        )}
        {directReferrals < 3 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-700 text-sm">Get {3 - directReferrals} more referral{3 - directReferrals !== 1 ? 's' : ''} to unlock daily earnings</p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
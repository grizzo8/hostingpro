import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function StatCard({ icon: Icon, label, value, change, changeType = "positive", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {change && (
              <p className={`text-sm mt-2 ${changeType === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {changeType === 'positive' ? '↑' : '↓'} {change}
              </p>
            )}
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
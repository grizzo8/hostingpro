import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Zap, BarChart3, Users, Shield, Gift } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const features = [
  {
    icon: DollarSign,
    title: 'High Commissions',
    description: 'Earn up to 70% on every sale with our industry-leading commission structure.',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Zap,
    title: 'Daily Payouts',
    description: 'Get paid daily directly to your PayPal. No waiting weeks for your earnings.',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track clicks, conversions, and earnings with our powerful dashboard.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Tiered Rewards',
    description: 'Unlock higher commissions and exclusive perks as you grow.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: '90-Day Cookie',
    description: 'Extended tracking ensures you get credit for delayed purchases.',
    gradient: 'from-rose-500 to-red-500'
  },
  {
    icon: Gift,
    title: 'Recurring Income',
    description: 'Earn on renewals too. Build passive income that grows over time.',
    gradient: 'from-indigo-500 to-violet-500'
  }
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Affiliates <span className="text-emerald-400">Love</span> Us
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to build a successful hosting affiliate business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="p-8 h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
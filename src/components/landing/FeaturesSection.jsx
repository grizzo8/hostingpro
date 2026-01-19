import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Zap, BarChart3, Users, Shield, Gift } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const features = [
  {
    icon: DollarSign,
    title: 'Choose Your Hosting Package',
    description: 'Select your hosting package ($20-$999). Make one payment to get started. Your payment goes to admin as the platform fee, and you receive your affiliate link via email.\n\n⏱️ One-time payment only',
    gradient: 'from-red-600 to-red-500'
  },
  {
    icon: Zap,
    title: 'Get 3 Referrals',
    description: 'Share your unique referral link with 3 people. When they sign up and pay, you\'ve doubled your money! Your 1st sale = 100% yours, 2nd sale = admin, 3rd+ sales = 100% yours.\n\n💰 Double your money at 3 referrals',
    gradient: 'from-blue-600 to-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Earn Daily Passive Income',
    description: 'Once you hit 3 referrals, daily billing activates. Every single day, you receive automatic PayPal payments from new sales. The higher your package, the more you earn daily!\n\n📈 Automatic daily PayPal payouts',
    gradient: 'from-red-600 to-blue-600'
  }
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            How HostingPro Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A simple 3-step system to build daily passive income. The higher you invest, the more you earn!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="p-8 h-full">
                <div className="text-4xl font-bold text-red-600 mb-4">
                  {features.indexOf(feature) + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 whitespace-pre-line text-sm">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GlassCard from '@/components/ui/GlassCard';

export default function PackagesPreview({ packages }) {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hosting Packages You'll <span className="text-blue-400">Promote</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Premium hosting solutions that sell themselves
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.slice(0, 3).map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className={`p-8 relative ${pkg.is_popular ? 'border-blue-500/50 bg-blue-500/5' : ''}`}>
                {pkg.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{pkg.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${pkg.monthly_price}</span>
                  <span className="text-gray-400">/mo</span>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-6">
                  <p className="text-emerald-400 font-semibold text-center">
                    {pkg.commission_rate}% Commission
                    {pkg.recurring_commission && ' • Recurring'}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features?.slice(0, 5).map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl('Packages')}>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
              View All Packages <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
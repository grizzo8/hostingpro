import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of successful affiliates and start earning passive income today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['Free to Join', 'No Minimum Payout', 'Instant Approval'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link to={createPageUrl('AffiliateSignup')}>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-10 py-6 text-lg rounded-xl shadow-2xl">
              Become an Affiliate
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
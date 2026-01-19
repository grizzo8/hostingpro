import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';

export default function ReferralLinksList({ affiliate, packages = [] }) {
  const [copiedLink, setCopiedLink] = useState(null);
  const domain = 'https://sales1.rentapog.com';
  const referralCode = affiliate?.referral_code;

  const copyToClipboard = (link, linkId) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(linkId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const mainLink = `${domain}/ref/${referralCode}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <GlassCard className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Referral Links</h2>
        <p className="text-gray-300 mb-8">Generate and manage your unique referral links for each package.</p>

        {/* Main Referral Link */}
        <div className="mb-8 pb-8 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Your Main Referral Link</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={mainLink}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-900 border border-white/20 text-white rounded-lg font-mono text-sm"
            />
            <Button
              onClick={() => copyToClipboard(mainLink, 'main')}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white"
            >
              {copiedLink === 'main' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="ml-2 hidden sm:inline">{copiedLink === 'main' ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
        </div>

        {/* Package-Specific Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">Package-Specific Links</h3>
          <div className="grid gap-6">
            {packages.map((pkg, idx) => {
              const packageLink = `${domain}/ref/${referralCode}?pkg=${pkg.slug}`;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white font-semibold">{pkg.name}</p>
                      <p className="text-gray-400 text-sm">${pkg.price}/mo • 100% commission</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={packageLink}
                      readOnly
                      className="flex-1 px-4 py-2 bg-slate-900 border border-white/20 text-white rounded-lg font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(packageLink, pkg.id)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {copiedLink === pkg.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">{copiedLink === pkg.id ? 'Copied!' : 'Copy Link'}</span>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Marketing Tips */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Marketing Tips</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white font-semibold mb-2">📝 Write Reviews</p>
              <p className="text-gray-400 text-sm">Create honest reviews comparing hosting providers</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white font-semibold mb-2">📱 Social Sharing</p>
              <p className="text-gray-400 text-sm">Share your links on Twitter, Facebook, and LinkedIn</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white font-semibold mb-2">✉️ Email Marketing</p>
              <p className="text-gray-400 text-sm">Include links in your newsletter and email campaigns</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
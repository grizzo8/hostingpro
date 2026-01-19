import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Copy, Check, ExternalLink, Server, Cloud, Building, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';

export default function AffiliateLinks() {
  const [user, setUser] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AffiliateLinks'));
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    };
    checkAuth();
  }, []);

  const { data: affiliate } = useQuery({
    queryKey: ['affiliate', user?.email],
    queryFn: async () => {
      const affiliates = await base44.entities.Affiliate.filter({ user_email: user.email });
      return affiliates[0];
    },
    enabled: !!user?.email
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.HostingPackage.filter({ is_active: true }, 'sort_order')
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const copyLink = (pkg) => {
    const link = `https://hostingpro.com/ref/${affiliate?.referral_code}?pkg=${pkg.slug || pkg.id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(pkg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (index) => {
    const icons = [Server, Cloud, Building, Zap];
    return icons[index % icons.length];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <DashboardSidebar onLogout={handleLogout} />
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader 
          user={user} 
          affiliate={affiliate} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Referral Links</h1>
              <p className="text-gray-400">Generate and manage your unique referral links for each package.</p>
            </motion.div>

            {/* Main Referral Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Main Referral Link</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    value={`https://hostingpro.com/ref/${affiliate?.referral_code || '...'}`}
                    readOnly
                    className="flex-1 bg-white/5 border-white/10 text-white font-mono"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://hostingpro.com/ref/${affiliate?.referral_code}`);
                      setCopiedId('main');
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                  >
                    {copiedId === 'main' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedId === 'main' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Package-Specific Links */}
            <div className="grid md:grid-cols-2 gap-6">
              {packages.map((pkg, i) => {
                const Icon = getIcon(i);
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <GlassCard className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                          <p className="text-gray-400 text-sm">${pkg.monthly_price}/mo • {pkg.commission_rate}% commission</p>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3 mb-4">
                        <p className="text-gray-400 text-xs mb-1">Package-specific link</p>
                        <p className="text-white font-mono text-sm truncate">
                          https://hostingpro.com/ref/{affiliate?.referral_code}?pkg={pkg.slug || pkg.id}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyLink(pkg)}
                          variant="outline"
                          className="flex-1 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                        >
                          {copiedId === pkg.id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                          {copiedId === pkg.id ? 'Copied!' : 'Copy Link'}
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>

            {/* Marketing Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Marketing Tips</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Write Reviews', desc: 'Create honest reviews comparing hosting providers' },
                    { title: 'Social Sharing', desc: 'Share your links on Twitter, Facebook, and LinkedIn' },
                    { title: 'Email Marketing', desc: 'Include links in your newsletter and email campaigns' }
                  ].map((tip) => (
                    <div key={tip.title} className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-2">{tip.title}</h4>
                      <p className="text-gray-400 text-sm">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
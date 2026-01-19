import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { Users, Search, Filter, Globe, RefreshCcw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';

export default function AffiliateReferrals() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [billingFilter, setBillingFilter] = useState('all');

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AffiliateReferrals'));
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

  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals', affiliate?.id],
    queryFn: () => base44.entities.Referral.filter({ affiliate_id: affiliate.id }, '-created_date'),
    enabled: !!affiliate?.id
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = !search || 
      r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchesBilling = billingFilter === 'all' || r.billing_cycle === billingFilter;
    return matchesSearch && matchesBilling;
  });

  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.status !== 'refunded').length;
  const recurringReferrals = referrals.filter(r => r.is_recurring).length;

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
              <h1 className="text-3xl font-bold text-white mb-2">Referrals</h1>
              <p className="text-gray-400">View and manage all your referred customers.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={Users}
                label="Total Referrals"
                value={totalReferrals}
                delay={0.1}
              />
              <StatCard
                icon={Globe}
                label="Active Customers"
                value={activeReferrals}
                delay={0.2}
              />
              <StatCard
                icon={RefreshCcw}
                label="Recurring"
                value={recurringReferrals}
                delay={0.3}
              />
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Select value={billingFilter} onValueChange={setBillingFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Billing" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Billing</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </GlassCard>
            </motion.div>

            {/* Referrals List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Package</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Billing</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Sign Up Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Source</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReferrals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                            <p>No referrals found</p>
                            <p className="text-sm text-gray-500 mt-1">Share your link to start referring customers</p>
                          </td>
                        </tr>
                      ) : (
                        filteredReferrals.map((referral) => (
                          <tr key={referral.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-medium">
                                  {(referral.customer_name || referral.customer_email || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{referral.customer_name || 'Anonymous'}</p>
                                  <p className="text-gray-400 text-sm">{referral.customer_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{referral.package_name}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300 capitalize">{referral.billing_cycle}</span>
                                {referral.is_recurring && (
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-xs">
                                    <RefreshCcw className="w-3 h-3 mr-1" />
                                    Recurring
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {format(new Date(referral.created_date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-gray-400">{referral.referral_source || '-'}</td>
                            <td className="px-6 py-4">
                              <Badge className={`border ${
                                referral.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                referral.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                referral.status === 'refunded' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}>
                                {referral.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
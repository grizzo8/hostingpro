import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { DollarSign, Clock, CheckCircle, AlertCircle, Download, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  approved: { label: 'Approved', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle },
  paid: { label: 'Paid', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
  refunded: { label: 'Refunded', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', icon: AlertCircle }
};

export default function AffiliateCommissions() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AffiliateCommissions'));
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

  const { data: payouts = [] } = useQuery({
    queryKey: ['payouts', affiliate?.id],
    queryFn: () => base44.entities.Payout.filter({ affiliate_id: affiliate.id }, '-created_date'),
    enabled: !!affiliate?.id
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const filteredReferrals = statusFilter === 'all' 
    ? referrals 
    : referrals.filter(r => r.status === statusFilter);

  const totalEarnings = referrals.filter(r => r.status === 'paid').reduce((sum, r) => sum + (r.commission_amount || 0), 0);
  const pendingEarnings = referrals.filter(r => r.status === 'pending' || r.status === 'approved').reduce((sum, r) => sum + (r.commission_amount || 0), 0);
  const thisMonthEarnings = referrals.filter(r => {
    const date = new Date(r.created_date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && r.status === 'paid';
  }).reduce((sum, r) => sum + (r.commission_amount || 0), 0);

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
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Commissions</h1>
                <p className="text-gray-400">Track your earnings and payment history.</p>
              </div>
              <Button className="bg-white/10 hover:bg-white/20 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={DollarSign}
                label="Total Earnings"
                value={`$${totalEarnings.toFixed(2)}`}
                delay={0.1}
              />
              <StatCard
                icon={Clock}
                label="Pending Payout"
                value={`$${pendingEarnings.toFixed(2)}`}
                delay={0.2}
              />
              <StatCard
                icon={DollarSign}
                label="This Month"
                value={`$${thisMonthEarnings.toFixed(2)}`}
                delay={0.3}
              />
            </div>

            {/* Commissions Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">Commission History</h3>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Package</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Sale Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Commission</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReferrals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            No commissions found
                          </td>
                        </tr>
                      ) : (
                        filteredReferrals.map((referral) => {
                          const config = statusConfig[referral.status] || statusConfig.pending;
                          return (
                            <tr key={referral.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 text-white">
                                {format(new Date(referral.created_date), 'MMM d, yyyy')}
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-white">{referral.customer_name || 'Anonymous'}</p>
                                <p className="text-gray-400 text-sm">{referral.customer_email}</p>
                              </td>
                              <td className="px-6 py-4 text-gray-300">{referral.package_name}</td>
                              <td className="px-6 py-4 text-gray-300">${referral.sale_amount?.toFixed(2)}</td>
                              <td className="px-6 py-4 text-emerald-400 font-semibold">
                                +${referral.commission_amount?.toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${config.color} border`}>
                                  {config.label}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </motion.div>

            {/* Payout History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Payout History</h3>
                {payouts.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No payouts yet</p>
                    <p className="text-gray-500 text-sm">Payouts are processed daily for approved commissions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payouts.map((payout) => (
                      <div key={payout.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-white font-medium">${payout.amount?.toFixed(2)}</p>
                          <p className="text-gray-400 text-sm">
                            {payout.processed_at ? format(new Date(payout.processed_at), 'MMM d, yyyy') : 'Processing...'}
                          </p>
                        </div>
                        <Badge className={`${statusConfig[payout.status]?.color || 'bg-gray-500/20 text-gray-400'} border`}>
                          {payout.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
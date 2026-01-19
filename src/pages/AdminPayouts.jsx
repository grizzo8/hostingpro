import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { DollarSign, Clock, CheckCircle, XCircle, Search, Filter, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  processing: { label: 'Processing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  failed: { label: 'Failed', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' }
};

export default function AdminPayouts() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AdminPayouts'));
        return;
      }
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        window.location.href = createPageUrl('AffiliateDashboard');
        return;
      }
      setUser(userData);
    };
    checkAuth();
  }, []);

  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ['all-payouts'],
    queryFn: () => base44.entities.Payout.list('-created_date', 100)
  });

  const { data: affiliates = [] } = useQuery({
    queryKey: ['all-affiliates'],
    queryFn: () => base44.entities.Affiliate.list()
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ['pending-referrals'],
    queryFn: () => base44.entities.Referral.filter({ status: 'approved' })
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const updatePayoutMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await base44.entities.Payout.update(id, { 
        status, 
        processed_at: status === 'completed' ? new Date().toISOString() : null 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-payouts']);
    }
  });

  const createPayoutMutation = useMutation({
    mutationFn: async (affiliateId) => {
      const affiliate = affiliates.find(a => a.id === affiliateId);
      if (!affiliate || !affiliate.pending_balance || affiliate.pending_balance <= 0) return;
      
      await base44.entities.Payout.create({
        affiliate_id: affiliateId,
        affiliate_email: affiliate.user_email,
        paypal_email: affiliate.paypal_email,
        amount: affiliate.pending_balance,
        status: 'pending'
      });

      // Reset pending balance
      await base44.entities.Affiliate.update(affiliateId, { pending_balance: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-payouts']);
      queryClient.invalidateQueries(['all-affiliates']);
    }
  });

  const filteredPayouts = payouts.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = !search || 
      p.affiliate_email?.toLowerCase().includes(search.toLowerCase()) ||
      p.paypal_email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPending = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalProcessing = payouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPaid = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);

  // Affiliates with pending balance
  const affiliatesWithBalance = affiliates.filter(a => a.pending_balance > 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onLogout={handleLogout} />
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
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Payouts</h1>
              <p className="text-gray-400">Process daily PayPal payouts to affiliates.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={Clock}
                label="Pending Payouts"
                value={`$${totalPending.toFixed(2)}`}
                delay={0.1}
              />
              <StatCard
                icon={DollarSign}
                label="Processing"
                value={`$${totalProcessing.toFixed(2)}`}
                delay={0.2}
              />
              <StatCard
                icon={CheckCircle}
                label="Total Paid"
                value={`$${totalPaid.toFixed(2)}`}
                delay={0.3}
              />
            </div>

            {/* Pending Balances */}
            {affiliatesWithBalance.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Affiliates Ready for Payout</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {affiliatesWithBalance.map((aff) => (
                      <div key={aff.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{aff.full_name || aff.user_email}</p>
                          <p className="text-gray-400 text-sm">{aff.paypal_email}</p>
                          <p className="text-emerald-400 font-bold mt-1">${aff.pending_balance?.toFixed(2)}</p>
                        </div>
                        <Button
                          onClick={() => createPayoutMutation.mutate(aff.id)}
                          disabled={createPayoutMutation.isPending}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search by email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </GlassCard>
            </motion.div>

            {/* Payouts Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Affiliate</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">PayPal</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : filteredPayouts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            No payouts found
                          </td>
                        </tr>
                      ) : (
                        filteredPayouts.map((payout) => (
                          <tr key={payout.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-gray-300">
                              {format(new Date(payout.created_date), 'MMM d, yyyy h:mm a')}
                            </td>
                            <td className="px-6 py-4 text-white">{payout.affiliate_email}</td>
                            <td className="px-6 py-4 text-gray-300">{payout.paypal_email}</td>
                            <td className="px-6 py-4 text-emerald-400 font-bold">${payout.amount?.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <Badge className={`border ${statusConfig[payout.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                                {statusConfig[payout.status]?.label || payout.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {payout.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updatePayoutMutation.mutate({ id: payout.id, status: 'processing' })}
                                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                    >
                                      Process
                                    </Button>
                                  </>
                                )}
                                {payout.status === 'processing' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updatePayoutMutation.mutate({ id: payout.id, status: 'completed' })}
                                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" /> Complete
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => updatePayoutMutation.mutate({ id: payout.id, status: 'failed' })}
                                      variant="ghost"
                                      className="text-rose-400 hover:bg-rose-500/20"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
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
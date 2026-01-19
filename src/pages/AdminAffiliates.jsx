import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { Users, Search, Filter, CheckCircle, XCircle, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';

export default function AdminAffiliates() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AdminAffiliates'));
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

  const { data: affiliates = [], isLoading } = useQuery({
    queryKey: ['all-affiliates'],
    queryFn: () => base44.entities.Affiliate.list('-created_date', 100)
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const updateAffiliateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await base44.entities.Affiliate.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-affiliates']);
    }
  });

  const filteredAffiliates = affiliates.filter(aff => {
    const matchesSearch = !search || 
      aff.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      aff.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      aff.referral_code?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || aff.status === statusFilter;
    const matchesTier = tierFilter === 'all' || aff.tier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

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
              <h1 className="text-3xl font-bold text-white mb-2">Affiliates</h1>
              <p className="text-gray-400">Manage and monitor all affiliate accounts.</p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search by name, email or code..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </GlassCard>
            </motion.div>

            {/* Affiliates Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Affiliate</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Code</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tier</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Referrals</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Earnings</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : filteredAffiliates.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                            No affiliates found
                          </td>
                        </tr>
                      ) : (
                        filteredAffiliates.map((aff) => (
                          <tr key={aff.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                                  {(aff.full_name || aff.user_email || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{aff.full_name || 'N/A'}</p>
                                  <p className="text-gray-400 text-sm">{aff.user_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-300">{aff.referral_code}</td>
                            <td className="px-6 py-4">
                              <Badge className={`border capitalize ${
                                aff.tier === 'platinum' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                aff.tier === 'gold' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                aff.tier === 'silver' ? 'bg-gray-400/20 text-gray-300 border-gray-400/30' :
                                'bg-orange-500/20 text-orange-400 border-orange-500/30'
                              }`}>
                                {aff.tier}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{aff.total_referrals || 0}</td>
                            <td className="px-6 py-4 text-emerald-400 font-medium">${(aff.total_earnings || 0).toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <Badge className={`border ${
                                aff.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                aff.status === 'suspended' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                                'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}>
                                {aff.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                                  <DropdownMenuItem 
                                    onClick={() => setSelectedAffiliate(aff)}
                                    className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10"
                                  >
                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  {aff.status === 'pending' && (
                                    <DropdownMenuItem 
                                      onClick={() => updateAffiliateMutation.mutate({ id: aff.id, data: { status: 'approved' } })}
                                      className="text-emerald-400 hover:text-emerald-300 focus:text-emerald-300 focus:bg-emerald-500/10"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                    </DropdownMenuItem>
                                  )}
                                  {aff.status === 'approved' && (
                                    <DropdownMenuItem 
                                      onClick={() => updateAffiliateMutation.mutate({ id: aff.id, data: { status: 'suspended' } })}
                                      className="text-rose-400 hover:text-rose-300 focus:text-rose-300 focus:bg-rose-500/10"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" /> Suspend
                                    </DropdownMenuItem>
                                  )}
                                  {aff.status === 'suspended' && (
                                    <DropdownMenuItem 
                                      onClick={() => updateAffiliateMutation.mutate({ id: aff.id, data: { status: 'approved' } })}
                                      className="text-emerald-400 hover:text-emerald-300 focus:text-emerald-300 focus:bg-emerald-500/10"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" /> Reactivate
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
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

      {/* Affiliate Details Dialog */}
      <Dialog open={!!selectedAffiliate} onOpenChange={() => setSelectedAffiliate(null)}>
        <DialogContent className="bg-slate-900 border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Affiliate Details</DialogTitle>
          </DialogHeader>
          {selectedAffiliate && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {(selectedAffiliate.full_name || selectedAffiliate.user_email || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedAffiliate.full_name || 'N/A'}</h3>
                  <p className="text-gray-400">{selectedAffiliate.user_email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Referral Code</p>
                  <p className="text-white font-mono text-lg">{selectedAffiliate.referral_code}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">PayPal Email</p>
                  <p className="text-white">{selectedAffiliate.paypal_email || 'Not set'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Total Earnings</p>
                  <p className="text-emerald-400 text-lg font-bold">${(selectedAffiliate.total_earnings || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Pending Balance</p>
                  <p className="text-amber-400 text-lg font-bold">${(selectedAffiliate.pending_balance || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Total Referrals</p>
                  <p className="text-white text-lg font-bold">{selectedAffiliate.total_referrals || 0}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Conversion Rate</p>
                  <p className="text-white text-lg font-bold">{(selectedAffiliate.conversion_rate || 0).toFixed(1)}%</p>
                </div>
              </div>

              {selectedAffiliate.website_url && (
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Website</p>
                  <a href={selectedAffiliate.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {selectedAffiliate.website_url}
                  </a>
                </div>
              )}

              {selectedAffiliate.promotion_methods?.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Promotion Methods</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAffiliate.promotion_methods.map(method => (
                      <Badge key={method} className="bg-white/10 text-gray-300 border-white/20">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Select
                  value={selectedAffiliate.tier}
                  onValueChange={(tier) => {
                    updateAffiliateMutation.mutate({ id: selectedAffiliate.id, data: { tier } });
                    setSelectedAffiliate(prev => ({ ...prev, tier }));
                  }}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedAffiliate.status}
                  onValueChange={(status) => {
                    updateAffiliateMutation.mutate({ id: selectedAffiliate.id, data: { status } });
                    setSelectedAffiliate(prev => ({ ...prev, status }));
                  }}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
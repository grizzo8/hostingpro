import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';
import ResellerManagement from '@/components/admin/ResellerManagement';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AdminDashboard'));
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

  const { data: affiliates = [] } = useQuery({
    queryKey: ['all-affiliates'],
    queryFn: () => base44.entities.Affiliate.list('-created_date', 100)
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ['all-referrals'],
    queryFn: () => base44.entities.Referral.list('-created_date', 100)
  });

  const { data: payouts = [] } = useQuery({
    queryKey: ['all-payouts'],
    queryFn: () => base44.entities.Payout.list('-created_date', 50)
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  // Calculate stats
  const totalRevenue = referrals.reduce((sum, r) => sum + (r.sale_amount || 0), 0);
  const totalCommissions = referrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const activeAffiliates = affiliates.filter(a => a.status === 'approved').length;

  // Tier distribution
  const tierData = ['bronze', 'silver', 'gold', 'platinum'].map(tier => ({
    name: tier.charAt(0).toUpperCase() + tier.slice(1),
    value: affiliates.filter(a => a.tier === tier).length
  })).filter(d => d.value > 0);

  // Mock weekly data
  const weeklyData = [
    { day: 'Mon', revenue: 1200, commissions: 360 },
    { day: 'Tue', revenue: 1800, commissions: 540 },
    { day: 'Wed', revenue: 950, commissions: 285 },
    { day: 'Thu', revenue: 2500, commissions: 750 },
    { day: 'Fri', revenue: 3100, commissions: 930 },
    { day: 'Sat', revenue: 1800, commissions: 540 },
    { day: 'Sun', revenue: 2200, commissions: 660 },
  ];

  const recentAffiliates = affiliates.slice(0, 5);
  const pendingReferrals = referrals.filter(r => r.status === 'pending').slice(0, 5);

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
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Overview of your affiliate program performance.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                change="+23% this month"
                changeType="positive"
                delay={0.1}
              />
              <StatCard
                icon={DollarSign}
                label="Total Commissions"
                value={`$${totalCommissions.toFixed(2)}`}
                delay={0.2}
              />
              <StatCard
                icon={Users}
                label="Active Affiliates"
                value={activeAffiliates}
                change={`+${affiliates.filter(a => a.status === 'pending').length} pending`}
                changeType="positive"
                delay={0.3}
              />
              <StatCard
                icon={Clock}
                label="Pending Payouts"
                value={`$${pendingPayouts.toFixed(2)}`}
                delay={0.4}
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Revenue & Commissions</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="commissionsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="url(#revenueGrad)" />
                        <Area type="monotone" dataKey="commissions" stroke="#10b981" fill="url(#commissionsGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard className="p-6 h-full">
                  <h3 className="text-lg font-semibold text-white mb-6">Affiliate Tiers</h3>
                  {tierData.length > 0 ? (
                    <>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={tierData}
                              cx="50%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={60}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {tierData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {tierData.map((entry, index) => (
                          <div key={entry.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-400 text-sm">{entry.name}: {entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400">
                      No affiliates yet
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>

            {/* Reseller Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <ResellerManagement affiliates={affiliates} />
            </motion.div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Affiliates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Recent Affiliate Signups</h3>
                  {recentAffiliates.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No affiliates yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentAffiliates.map((aff) => (
                        <div key={aff.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                              {(aff.full_name || aff.user_email || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{aff.full_name || aff.user_email}</p>
                              <p className="text-gray-400 text-sm capitalize">{aff.tier} tier</p>
                            </div>
                          </div>
                          <Badge className={`border ${
                            aff.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            aff.status === 'suspended' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {aff.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Pending Referrals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Pending Commissions</h3>
                  {pendingReferrals.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No pending commissions
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingReferrals.map((ref) => (
                        <div key={ref.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div>
                            <p className="text-white font-medium">{ref.customer_name || ref.customer_email}</p>
                            <p className="text-gray-400 text-sm">{ref.package_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-amber-400 font-semibold">${ref.commission_amount?.toFixed(2)}</p>
                            <p className="text-gray-500 text-xs">
                              {format(new Date(ref.created_date), 'MMM d')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
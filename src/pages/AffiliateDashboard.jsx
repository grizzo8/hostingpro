import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  DollarSign, 
  Users, 
  MousePointerClick, 
  TrendingUp, 
  Copy, 
  Check,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';

export default function AffiliateDashboard() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AffiliateDashboard'));
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
    queryFn: () => base44.entities.Referral.filter({ affiliate_id: affiliate.id }),
    enabled: !!affiliate?.id
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const copyReferralLink = () => {
    if (affiliate?.referral_code) {
      navigator.clipboard.writeText(`https://hostingpro.com/ref/${affiliate.referral_code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mock chart data
  const chartData = [
    { name: 'Mon', earnings: 120 },
    { name: 'Tue', earnings: 180 },
    { name: 'Wed', earnings: 95 },
    { name: 'Thu', earnings: 250 },
    { name: 'Fri', earnings: 310 },
    { name: 'Sat', earnings: 180 },
    { name: 'Sun', earnings: 220 },
  ];

  const recentReferrals = referrals.slice(0, 5);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <DashboardSidebar onLogout={handleLogout} />
      </div>
      
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader 
          user={user} 
          affiliate={affiliate} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-400">Here's how your affiliate business is performing.</p>
            </motion.div>

            {/* Referral Link Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Your Referral Link</p>
                    <p className="text-white font-mono text-lg">
                      https://hostingpro.com/ref/{affiliate?.referral_code || '...'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={copyReferralLink}
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                label="Total Earnings"
                value={`$${(affiliate?.total_earnings || 0).toFixed(2)}`}
                change="+12.5% this month"
                changeType="positive"
                delay={0.2}
              />
              <StatCard
                icon={DollarSign}
                label="Pending Balance"
                value={`$${(affiliate?.pending_balance || 0).toFixed(2)}`}
                delay={0.3}
              />
              <StatCard
                icon={Users}
                label="Total Referrals"
                value={affiliate?.total_referrals || 0}
                change="+5 this week"
                changeType="positive"
                delay={0.4}
              />
              <StatCard
                icon={TrendingUp}
                label="Conversion Rate"
                value={`${(affiliate?.conversion_rate || 0).toFixed(1)}%`}
                change="+2.3%"
                changeType="positive"
                delay={0.5}
              />
            </div>

            {/* Charts & Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Earnings Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-2"
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Earnings Overview</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="url(#gradient)" 
                          strokeWidth={3}
                          dot={false}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Recent Referrals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard className="p-6 h-full">
                  <h3 className="text-lg font-semibold text-white mb-6">Recent Referrals</h3>
                  {recentReferrals.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No referrals yet</p>
                      <p className="text-gray-500 text-sm">Share your link to start earning</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentReferrals.map((referral) => (
                        <div key={referral.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{referral.customer_name || referral.customer_email}</p>
                            <p className="text-gray-400 text-sm">{referral.package_name}</p>
                          </div>
                          <span className={`text-sm font-medium ${
                            referral.status === 'paid' ? 'text-emerald-400' : 
                            referral.status === 'approved' ? 'text-blue-400' : 'text-amber-400'
                          }`}>
                            +${referral.commission_amount?.toFixed(2)}
                          </span>
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
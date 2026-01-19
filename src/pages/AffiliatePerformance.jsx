import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { TrendingUp, MousePointerClick, Users, DollarSign, Target, Award } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AffiliatePerformance() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AffiliatePerformance'));
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

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', clicks: 45, conversions: 3, earnings: 120 },
    { day: 'Tue', clicks: 52, conversions: 4, earnings: 180 },
    { day: 'Wed', clicks: 38, conversions: 2, earnings: 95 },
    { day: 'Thu', clicks: 65, conversions: 5, earnings: 250 },
    { day: 'Fri', clicks: 78, conversions: 6, earnings: 310 },
    { day: 'Sat', clicks: 55, conversions: 4, earnings: 180 },
    { day: 'Sun', clicks: 48, conversions: 4, earnings: 220 },
  ];

  const packageData = referrals.reduce((acc, r) => {
    const name = r.package_name || 'Unknown';
    const existing = acc.find(p => p.name === name);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name, value: 1 });
    }
    return acc;
  }, []);

  const tierProgress = {
    bronze: { current: 'bronze', next: 'silver', progress: 40, requirement: 'Refer 10 customers' },
    silver: { current: 'silver', next: 'gold', progress: 60, requirement: 'Refer 25 customers' },
    gold: { current: 'gold', next: 'platinum', progress: 75, requirement: 'Refer 50 customers' },
    platinum: { current: 'platinum', next: null, progress: 100, requirement: 'Maximum tier reached' },
  };

  const currentTier = tierProgress[affiliate?.tier || 'bronze'];

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
              <h1 className="text-3xl font-bold text-white mb-2">Performance</h1>
              <p className="text-gray-400">Analyze your affiliate marketing performance.</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={MousePointerClick}
                label="Total Clicks"
                value="1,247"
                change="+18%"
                changeType="positive"
                delay={0.1}
              />
              <StatCard
                icon={Users}
                label="Conversions"
                value={referrals.length}
                change="+12%"
                changeType="positive"
                delay={0.2}
              />
              <StatCard
                icon={Target}
                label="Conversion Rate"
                value={`${((affiliate?.conversion_rate || 0)).toFixed(1)}%`}
                change="+2.1%"
                changeType="positive"
                delay={0.3}
              />
              <StatCard
                icon={DollarSign}
                label="Avg. Commission"
                value={`$${referrals.length > 0 ? (referrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0) / referrals.length).toFixed(2) : '0.00'}`}
                delay={0.4}
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Weekly Earnings</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
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
                          labelStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="earnings" stroke="#10b981" fillOpacity={1} fill="url(#earningsGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Clicks vs Conversions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Clicks vs Conversions</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Package Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Package Distribution</h3>
                  {packageData.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      No data available
                    </div>
                  ) : (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={packageData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {packageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {packageData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-gray-400 text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Tier Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="lg:col-span-2"
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">Tier Progress</h3>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                      affiliate?.tier === 'platinum' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                      affiliate?.tier === 'gold' ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                      affiliate?.tier === 'silver' ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      'bg-gradient-to-br from-amber-600 to-amber-700'
                    }`}>
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white capitalize">{affiliate?.tier || 'Bronze'}</p>
                      <p className="text-gray-400">Current Tier</p>
                    </div>
                  </div>

                  {currentTier.next && (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress to {currentTier.next}</span>
                          <span className="text-white">{currentTier.progress}%</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${currentTier.progress}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {currentTier.requirement} to unlock higher commissions
                      </p>
                    </>
                  )}

                  <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                    {['bronze', 'silver', 'gold', 'platinum'].map((tier, i) => (
                      <div key={tier} className={`text-center ${affiliate?.tier === tier ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                          tier === 'platinum' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                          tier === 'gold' ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                          tier === 'silver' ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          'bg-gradient-to-br from-amber-600 to-amber-700'
                        }`}>
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-white text-sm capitalize">{tier}</p>
                        <p className="text-gray-500 text-xs">{[50, 60, 65, 70][i]}%</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
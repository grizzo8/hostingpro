import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { User, CreditCard, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';

export default function AffiliateSettings() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    paypal_email: '',
    website_url: '',
    promotion_methods: [],
    notes: ''
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AffiliateSettings'));
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

  useEffect(() => {
    if (affiliate) {
      setFormData({
        paypal_email: affiliate.paypal_email || '',
        website_url: affiliate.website_url || '',
        promotion_methods: affiliate.promotion_methods || [],
        notes: affiliate.notes || ''
      });
    }
  }, [affiliate]);

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Affiliate.update(affiliate.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['affiliate', user?.email]);
    }
  });

  const promotionMethods = [
    'Website/Blog',
    'Social Media',
    'YouTube',
    'Email Marketing',
    'Paid Ads',
    'Forums/Communities'
  ];

  const toggleMethod = (method) => {
    setFormData(prev => ({
      ...prev,
      promotion_methods: prev.promotion_methods.includes(method)
        ? prev.promotion_methods.filter(m => m !== method)
        : [...prev.promotion_methods, method]
    }));
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
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your affiliate account settings.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="payout" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payout
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-300">Full Name</Label>
                          <Input
                            value={user.full_name || ''}
                            disabled
                            className="mt-2 bg-white/5 border-white/10 text-gray-400"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Email</Label>
                          <Input
                            value={user.email || ''}
                            disabled
                            className="mt-2 bg-white/5 border-white/10 text-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300">Referral Code</Label>
                        <Input
                          value={affiliate?.referral_code || ''}
                          disabled
                          className="mt-2 bg-white/5 border-white/10 text-gray-400 font-mono"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300">Website URL</Label>
                        <Input
                          type="url"
                          placeholder="https://yoursite.com"
                          value={formData.website_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                          className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-3 block">Promotion Methods</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {promotionMethods.map((method) => (
                            <button
                              key={method}
                              onClick={() => toggleMethod(method)}
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                formData.promotion_methods.includes(method)
                                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300">Bio / Notes</Label>
                        <Textarea
                          placeholder="Tell us about yourself and how you plan to promote..."
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                        />
                      </div>

                      <Button
                        onClick={() => updateMutation.mutate()}
                        disabled={updateMutation.isPending}
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="payout">
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Payout Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-emerald-400 font-medium">Daily PayPal Payouts</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Your approved commissions are automatically paid daily to your PayPal account.
                        </p>
                      </div>

                      <div>
                        <Label className="text-gray-300">PayPal Email</Label>
                        <Input
                          type="email"
                          placeholder="paypal@email.com"
                          value={formData.paypal_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, paypal_email: e.target.value }))}
                          className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        <p className="text-gray-500 text-sm mt-2">
                          Make sure this email matches your PayPal account exactly.
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">Minimum Payout</p>
                            <p className="text-gray-400 text-sm">No minimum required</p>
                          </div>
                          <p className="text-2xl font-bold text-emerald-400">$0.00</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => updateMutation.mutate()}
                        disabled={updateMutation.isPending}
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Update Payout Settings
                      </Button>
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="notifications">
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
                    
                    <div className="space-y-6">
                      {[
                        { id: 'referral', label: 'New Referral', desc: 'Get notified when someone signs up using your link' },
                        { id: 'commission', label: 'Commission Approved', desc: 'Get notified when a commission is approved' },
                        { id: 'payout', label: 'Payout Sent', desc: 'Get notified when a payout is processed' },
                        { id: 'news', label: 'News & Updates', desc: 'Receive program updates and announcements' },
                        { id: 'tips', label: 'Marketing Tips', desc: 'Get tips to improve your affiliate performance' },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
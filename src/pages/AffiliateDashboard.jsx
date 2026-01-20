import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';
import EarningsOverview from '@/components/dashboard/EarningsOverview';
import ReferralStats from '@/components/dashboard/ReferralStats';
import PayoutHistory from '@/components/dashboard/PayoutHistory';
import MarketingMaterials from '@/components/dashboard/MarketingMaterials';
import ReferralLinksList from '@/components/dashboard/ReferralLinksList';

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

      // Handle PayPal return
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get('payment');
      const token = urlParams.get('token');
      const packageId = urlParams.get('packageId');
      const referralCode = urlParams.get('referralCode');

      if (paymentSuccess === 'success' && token && packageId) {
        try {
          // Capture the PayPal payment
          const captureResult = await base44.functions.invoke('handlePayPalCapture', {
            orderId: token,
            packageId: packageId,
            referralCode: referralCode || null
          });

          console.log('Payment captured successfully:', captureResult.data);

          // Clean up URL and show success
          window.history.replaceState({}, '', createPageUrl('AffiliateDashboard'));
          alert('Payment successful! Welcome to HostingPro. Check your email for login details.');
        } catch (error) {
          console.error('Payment capture failed:', error);
          alert('Payment processing failed. Please contact support.');
          window.history.replaceState({}, '', createPageUrl('AffiliateDashboard'));
        }
      }
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

  const { data: payouts = [] } = useQuery({
    queryKey: ['payouts', affiliate?.id],
    queryFn: () => base44.entities.Payout.filter({ affiliate_id: affiliate.id }),
    enabled: !!affiliate?.id
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.HostingPackage.filter({ is_active: true }, 'sort_order', 100)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
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
        
        <main className="flex-1 p-6 overflow-auto bg-white">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600">Track your earnings, referrals, and manage your affiliate account.</p>
            </motion.div>

            {/* Section 1: Earnings Overview */}
            <EarningsOverview affiliate={affiliate} />

            {/* Section 2: Referral Links */}
            <ReferralLinksList affiliate={affiliate} packages={packages} />

            {/* Section 3: Referral Tracking */}
            <ReferralStats referrals={referrals} affiliate={affiliate} />

            {/* Section 4: Payout & PayPal */}
            <PayoutHistory payouts={payouts} affiliate={affiliate} />

            {/* Section 5: Marketing Materials */}
            <MarketingMaterials affiliate={affiliate} />
          </div>
        </main>
      </div>
    </div>
  );
}
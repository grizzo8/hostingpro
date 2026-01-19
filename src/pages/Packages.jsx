import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Server, Cloud, Building, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function Packages() {
  const [user, setUser] = useState(null);
  const [loadingPayPal, setLoadingPayPal] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const { data: affiliate } = useQuery({
    queryKey: ['affiliate', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const affiliates = await base44.entities.Affiliate.filter({ user_email: user.email });
      return affiliates[0];
    },
    enabled: !!user?.email
  });

  const { data: maxPackage } = useQuery({
    queryKey: ['max-package', affiliate?.max_package_id],
    queryFn: async () => {
      if (!affiliate?.max_package_id) return null;
      return base44.entities.HostingPackage.get(affiliate.max_package_id);
    },
    enabled: !!affiliate?.max_package_id
  });

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['all-packages'],
    queryFn: () => base44.entities.HostingPackage.filter({ is_active: true }, 'sort_order')
  });

  const getIcon = (index) => {
    const icons = [Server, Cloud, Building, Zap];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const handleCheckout = async (pkg, billingType) => {
    if (!user) {
      await base44.auth.redirectToLogin(`/packages`);
      return;
    }
    
    setLoadingPayPal({ ...loadingPayPal, [`${pkg.id}-${billingType}`]: true });
    try {
      const response = await base44.functions.invoke('generatePayPalLink', {
        packageId: pkg.id,
        billingType: billingType
      });
      
      if (response.data?.paypalUrl) {
        window.location.href = response.data.paypalUrl;
      } else {
        alert('Error generating payment link');
      }
    } catch (error) {
      alert('Payment error: ' + error.message);
    } finally {
      setLoadingPayPal({ ...loadingPayPal, [`${pkg.id}-${billingType}`]: false });
    }
  };

  const handleTestPurchase = async (pkg) => {
    const referralCode = prompt('Enter your referral code to test:');
    if (!referralCode) return;

    setLoadingPayPal({ ...loadingPayPal, [`${pkg.id}-test`]: true });
    try {
      await base44.functions.invoke('testPurchase', {
        packageId: pkg.id,
        referralCode: referralCode
      });
      alert('✓ Test purchase created! Check your dashboard.');
    } catch (error) {
      alert('Test error: ' + error.message);
    } finally {
      setLoadingPayPal({ ...loadingPayPal, [`${pkg.id}-test`]: false });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              Hosting <span className="text-red-600">Packages</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Choose your package. After 3 referrals, earn daily passive income!
            </p>
          </motion.div>

          {isLoading ? (
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[1,2,3,4].map((i) => (
               <div key={i} className="h-[500px] bg-gray-200 rounded-2xl animate-pulse" />
             ))}
           </div>
          ) : (
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {packages.filter(pkg => !maxPackage || pkg.price <= maxPackage.price).map((pkg, i) => {
               const Icon = getIcon(i);
                
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <GlassCard className={`p-8 relative h-full flex flex-col ${pkg.is_popular ? 'border-red-400 ring-2 ring-red-400/20 scale-105' : 'border-red-600/30'}`}>
                      {pkg.is_popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" /> Most Popular
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 text-sm mb-6">{pkg.description}</p>
                      
                      <div className="mb-6 grid grid-cols-2 gap-3">
                         <GlassCard className="p-4 border-red-200 text-center">
                           <p className="text-xs text-gray-600 mb-2">Daily Plan</p>
                           <p className="text-2xl font-bold text-red-600 mb-3">${pkg.daily_price?.toFixed(2) || '0.00'}</p>
                           <p className="text-xs text-gray-500 mb-3">/day</p>
                           <Button 
                             className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2"
                             onClick={() => handleCheckout(pkg, 'daily')}
                             disabled={loadingPayPal[`${pkg.id}-daily`]}
                           >
                             {loadingPayPal[`${pkg.id}-daily`] ? <Loader className="w-3 h-3 animate-spin" /> : 'Pay Daily'}
                           </Button>
                         </GlassCard>

                         <GlassCard className="p-4 border-blue-200 text-center">
                           <p className="text-xs text-gray-600 mb-2">Monthly Plan</p>
                           <p className="text-2xl font-bold text-blue-600 mb-1">${pkg.monthly_price?.toFixed(2) || '0.00'}</p>
                           <p className="text-xs text-green-600 font-semibold mb-3">Save ${((pkg.daily_price * 30) - pkg.monthly_price).toFixed(2)}</p>
                           <Button 
                             className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2"
                             onClick={() => handleCheckout(pkg, 'monthly')}
                             disabled={loadingPayPal[`${pkg.id}-monthly`]}
                           >
                             {loadingPayPal[`${pkg.id}-monthly`] ? <Loader className="w-3 h-3 animate-spin" /> : 'Pay Monthly'}
                           </Button>
                         </GlassCard>
                       </div>

                       <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                         <div className="text-center">
                           <p className="text-xs text-gray-600 mb-2">After 3 referrals:</p>
                           <div className="text-2xl font-bold text-blue-600">${pkg.daily_payout}/day</div>
                           <p className="text-xs text-gray-600 mt-1">Automatic PayPal payouts</p>
                           <p className="text-xs text-gray-500 mt-2">*minus PayPal fees</p>
                         </div>
                       </div>

                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Commission Structure</p>
                          <p className="text-xs text-red-600">1st Sale: 100% Yours</p>
                          <p className="text-xs text-gray-600">2nd Sale: Admin Fee</p>
                          <p className="text-xs text-red-600 font-semibold">3rd+ Sales: 100% Yours</p>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features?.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3 text-gray-700">
                            <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-2">
                        <Button 
                          onClick={() => handleCheckout(pkg, 'monthly')}
                          disabled={loadingPayPal[`${pkg.id}-monthly`]}
                          className={`w-full py-6 rounded-xl ${pkg.is_popular 
                            ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700' 
                            : 'border-2 border-red-600 text-red-600 hover:bg-red-50'} text-white font-semibold`}
                        >
                          {loadingPayPal[`${pkg.id}-monthly`] ? <Loader className="w-4 h-4 animate-spin" /> : 'Get Started'}
                        </Button>
                        <button 
                          onClick={() => handleTestPurchase(pkg)}
                          disabled={loadingPayPal[`${pkg.id}-test`]}
                          className="w-full text-xs text-gray-500 hover:text-gray-700 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {loadingPayPal[`${pkg.id}-test`] ? 'Testing...' : 'Test Purchase'}
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
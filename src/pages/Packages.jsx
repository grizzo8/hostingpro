import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Server, Cloud, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function Packages() {
  const [user, setUser] = useState(null);
  const [billing, setBilling] = useState('monthly');

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

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['all-packages'],
    queryFn: () => base44.entities.HostingPackage.filter({ is_active: true }, 'sort_order')
  });

  const getIcon = (index) => {
    const icons = [Server, Cloud, Building, Zap];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user} />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Hosting <span className="text-emerald-400">Packages</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Premium hosting solutions with industry-leading affiliate commissions
            </p>

            <Tabs value={billing} onValueChange={setBilling} className="inline-flex">
              <TabsList className="bg-white/5 border border-white/10 p-1">
                <TabsTrigger 
                  value="monthly"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 px-6"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger 
                  value="yearly"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 px-6"
                >
                  Yearly <span className="ml-2 text-xs text-emerald-400">Save 20%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map((i) => (
                <div key={i} className="h-[500px] bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, i) => {
                const Icon = getIcon(i);
                const price = billing === 'yearly' ? pkg.yearly_price || pkg.monthly_price * 10 : pkg.monthly_price;
                
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <GlassCard className={`p-8 relative h-full flex flex-col ${pkg.is_popular ? 'border-blue-500/50 bg-blue-500/5 scale-105' : ''}`}>
                      {pkg.is_popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" /> Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                          <p className="text-gray-400 text-sm">{pkg.description}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <span className="text-5xl font-bold text-white">${price}</span>
                        <span className="text-gray-400">/{billing === 'yearly' ? 'yr' : 'mo'}</span>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Your Commission:</span>
                          <span className="text-2xl font-bold text-emerald-400">{pkg.commission_rate}%</span>
                        </div>
                        <p className="text-emerald-400/70 text-sm mt-1">
                          ${(price * pkg.commission_rate / 100).toFixed(2)} per sale
                          {pkg.recurring_commission && ' + recurring'}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features?.map((feature, j) => (
                          <li key={j} className="flex items-start gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className={`w-full py-6 rounded-xl ${pkg.is_popular 
                          ? 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600' 
                          : 'bg-white/10 hover:bg-white/20'} text-white`}
                      >
                        Get Affiliate Link
                      </Button>
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
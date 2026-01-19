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
             {packages.map((pkg, i) => {
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
                      
                      <div className="mb-6">
                        <div className="text-4xl font-bold text-red-600">${pkg.daily_payout}</div>
                        <div className="text-sm text-gray-600">daily after 3 referrals</div>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="text-center">
                          <span className="text-sm text-gray-600">100% Commission</span>
                          <p className="text-lg font-bold text-red-600">Your 1st & 3rd+ Sales</p>
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

                      <Button 
                        className={`w-full py-6 rounded-xl ${pkg.is_popular 
                          ? 'bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700' 
                          : 'border-2 border-red-600 text-red-600 hover:bg-red-50'} text-white font-semibold`}
                      >
                        Get Started
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
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, Award, Globe, Zap, CheckCircle } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function About() {
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

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Affiliates' },
    { icon: Award, value: '$2.5M+', label: 'Paid in Commissions' },
    { icon: Globe, value: '150+', label: 'Countries Served' },
    { icon: Zap, value: '99.9%', label: 'Uptime Guarantee' }
  ];

  const values = [
    { title: 'Transparency', desc: 'Clear commission structures with no hidden fees. What you see is what you earn.' },
    { title: 'Reliability', desc: 'Daily payouts, 24/7 support, and a platform you can count on.' },
    { title: 'Growth', desc: "We invest in your success with tools, training, and a tiered rewards system." },
    { title: 'Partnership', desc: "You're not just an affiliate – you're a partner in our mission." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              About <span className="text-red-600">HostingPro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're on a mission to create the most rewarding affiliate program in the hosting industry, 
              empowering entrepreneurs worldwide to build sustainable income.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 text-center bg-gradient-to-br from-blue-50 to-white">
                  <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-12 bg-gradient-to-br from-red-50 to-white">
              <h2 className="text-3xl font-bold text-red-600 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  HostingPro was founded with a simple belief: affiliates deserve better. 
                  After years of working with hosting companies that offered low commissions, 
                  slow payouts, and poor support, we decided to build something different.
                </p>
                <p>
                  Today, we're proud to offer the industry's highest commission rates, 
                  daily PayPal payouts, and a suite of tools designed to help our affiliates succeed. 
                  Our platform has helped thousands of content creators, bloggers, and marketers 
                  build sustainable passive income.
                </p>
                <p>
                  We're not just a hosting company – we're a community of ambitious individuals 
                  who believe in the power of partnership. When you join HostingPro, 
                  you're not just getting a referral program; you're joining a family.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-8 h-full bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                      <p className="text-gray-700">{value.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Zap, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import GlassCard from '@/components/ui/GlassCard';

const benefits = [
  'Up to 70% commission on every sale',
  'Daily PayPal payouts',
  '90-day cookie duration',
  'Recurring commissions on renewals',
  'Dedicated affiliate manager',
  'Marketing materials & resources'
];

export default function AffiliateSignup() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    website_url: '',
    paypal_email: '',
    promotion_methods: [],
    agreed_terms: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          paypal_email: userData.email
        }));
      }
    };
    checkAuth();
  }, []);

  const generateReferralCode = (email) => {
    const prefix = email.split('@')[0].slice(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${random}`;
  };

  const signupMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        base44.auth.redirectToLogin(createPageUrl('AffiliateSignup'));
        return;
      }

      // Check if already an affiliate
      const existing = await base44.entities.Affiliate.filter({ user_email: user.email });
      if (existing.length > 0) {
        window.location.href = createPageUrl('AffiliateDashboard');
        return;
      }

      const affiliate = await base44.entities.Affiliate.create({
        user_email: user.email,
        full_name: user.full_name,
        referral_code: generateReferralCode(user.email),
        paypal_email: formData.paypal_email,
        website_url: formData.website_url,
        promotion_methods: formData.promotion_methods,
        status: 'pending',
        tier: 'bronze',
        total_earnings: 0,
        pending_balance: 0,
        total_referrals: 0
      });

      window.location.href = createPageUrl('AffiliateDashboard');
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

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">HostingPro</span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Affiliate<br />
              <span className="text-red-500">Program</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10">
              Start earning passive income by promoting the best hosting solutions on the market.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-red-500" />
                  </div>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {user ? 'Complete Your Profile' : 'Create Your Account'}
              </h2>

              {user && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                  <p className="text-gray-400 text-sm">Logged in as</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <Label className="text-gray-300">Website URL (optional)</Label>
                  <Input
                    type="url"
                    placeholder="https://yoursite.com"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">PayPal Email</Label>
                  <Input
                    type="email"
                    placeholder="paypal@email.com"
                    value={formData.paypal_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, paypal_email: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-3 block">How will you promote?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {promotionMethods.map((method) => (
                      <button
                        key={method}
                        onClick={() => toggleMethod(method)}
                        className={`p-3 rounded-lg border text-sm transition-all ${
                          formData.promotion_methods.includes(method)
                            ? 'bg-red-600/20 border-red-600/50 text-red-500'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreed_terms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreed_terms: checked }))}
                    className="border-white/20 data-[state=checked]:bg-red-600"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer">
                    I agree to the Terms of Service and Affiliate Program Agreement
                  </label>
                </div>

                <Button
                  onClick={() => signupMutation.mutate()}
                  disabled={!formData.agreed_terms || signupMutation.isPending}
                  className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white py-6 rounded-xl"
                >
                  {signupMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : user ? (
                    <>
                      Complete Registration
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Sign Up & Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <p className="text-center text-gray-500 text-sm">
                  Already an affiliate?{' '}
                  <Link to={createPageUrl('AffiliateDashboard')} className="text-red-500 hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
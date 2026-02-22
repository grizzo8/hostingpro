import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPageUrl } from '@/utils';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }

    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.HostingPackage.filter({ is_active: true }, 'sort_order')
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog-preview'],
    queryFn: () => base44.entities.BlogPost.filter({ status: 'published' }, '-published_at', 3)
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-100/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Premium Hosting Solutions
            </div>
            <h1 className="text-6xl font-bold text-slate-900 mb-4">
              Premium Hosting.<br />
              <span className="text-red-600">Professional Service.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Enterprise-grade hosting solutions with 99.9% uptime guarantee. Built for businesses that demand reliability and performance.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">🚀 Why Choose Us:</h3>
              <div className="flex justify-center gap-8">
                <div className="text-left">
                  <p className="text-green-700 font-semibold">✓ 99.9% Uptime Guarantee</p>
                  <p className="text-green-700 font-semibold">✓ 24/7 Premium Support</p>
                </div>
                <div className="text-left">
                  <p className="text-green-700 font-semibold">✓ Lightning-Fast Performance</p>
                  <p className="text-green-700 font-semibold">Enterprise Solutions for All Businesses</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center mb-12">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Secure Infrastructure
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Competitive Pricing
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                High Performance
              </div>
            </div>

            <Link to={createPageUrl(`Packages${referralCode ? `?ref=${referralCode}` : ''}`)} className="inline-block">
              <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white rounded-xl px-8 py-6 text-lg">
                View Packages <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block text-sm font-semibold text-blue-600 mb-3">
              Pay Once → Get 2 Referrals → Earn Daily Forever
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How HostingPro Works</h2>
            <p className="text-xl text-gray-600">A simple 3-step system to build daily passive income. The higher you invest, the more you earn!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: 1,
                title: 'Choose Your Hosting Package',
                desc: 'Select your hosting package and make one payment to get started. You\'ll receive your unique affiliate link instantly and can start earning 70% commission on every referral right away.',
                badge: '⏱️ One-time payment only'
              },
              {
                num: 2,
                title: 'Get Just 2 Referrals',
                desc: 'Share your unique referral link. You earn 70% of every sale from your very first referral — no admin fees, no splits. With just 2 referrals you\'re already in profit! And this isn\'t a once-off payment — every time your referrals renew daily or monthly, you keep earning.',
                badge: '💰 In profit after just 2 referrals'
              },
              {
                num: 3,
                title: 'Earn Daily Passive Income — Every Day',
                desc: 'This is NOT a one-time commission. Every single day your referred customers are billed, you get paid 70% straight to your PayPal. Keep referring and hit 10 to unlock 75% Elite commission — forever!',
                badge: '📈 Daily PayPal payments — not once-off!'
              }
            ].map((step) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-8 h-full">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.desc}</p>
                  <p className="text-sm text-gray-500">{step.badge}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block text-sm font-semibold text-green-600 mb-3">
              Commission Structure
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Industry-Leading 70% Commissions</h2>
            <p className="text-xl text-gray-600">One of the highest commission rates in the industry—and it gets even better as you grow.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-8 bg-green-50 border-green-200 h-full">
                <div className="text-5xl font-black text-green-600 mb-2">70%</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Standard Commission</h3>
                <p className="text-gray-700 text-sm mb-4">Every sale you refer earns you <strong>70% of the sale price</strong>—paid directly to your PayPal. And this is <strong>not a once-off payment</strong>. Every day your referrals renew their billing, you get paid again automatically. No complicated tiers, no waiting.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ 70% of every sale — recurring daily</li>
                  <li>✓ Paid to PayPal every single day</li>
                  <li>✓ Starts from your very first referral</li>
                  <li>✓ Not a once-off — it keeps coming!</li>
                </ul>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-5xl font-black text-orange-500">75%</div>
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">LEVEL UP</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Elite Commission – 10+ Referrals</h3>
                <p className="text-gray-700 text-sm mb-4">Once you hit <strong>10 referrals</strong>, you automatically unlock <strong>75% commission</strong> on every sale going forward. This reward is our way of saying thank you to our top performers.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>⭐ Reach 10 referrals to unlock</li>
                  <li>⭐ 75% of every sale</li>
                  <li>⭐ Applies automatically, forever</li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>

          <GlassCard className="p-8 bg-slate-900 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-green-400 mb-2">70%</div>
                <p className="font-semibold">Referrals 1–9</p>
                <p className="text-gray-400 text-sm">Paid daily to PayPal</p>
              </div>
              <div className="border-l border-r border-slate-700">
                <div className="text-4xl font-black text-yellow-400 mb-2">75%</div>
                <p className="font-semibold">10+ Referrals</p>
                <p className="text-gray-400 text-sm">Elite tier, automatic upgrade</p>
              </div>
              <div>
                <div className="text-4xl font-black text-blue-400 mb-2">Daily</div>
                <p className="font-semibold">Payout Schedule</p>
                <p className="text-gray-400 text-sm">Straight to your PayPal</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Massive Bonus Rewards */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Massive Bonus Rewards</h2>
            <p className="text-xl text-gray-600">Earn huge one-time bonuses when you hit referral milestones at the Diamond Package ($999)</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              { icon: '🏅', num: 10, bonus: '$500', label: 'One-time bonus' },
              { icon: '⭐', num: 50, bonus: '$2,500', label: 'One-time bonus' },
              { icon: '👑', num: 100, bonus: '$10,000', label: 'One-time bonus + $1,000/day Forever!' }
            ].map((reward) => (
              <motion.div key={reward.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-8 text-center">
                  <div className="text-4xl mb-3">{reward.icon}</div>
                  <p className="text-gray-600 mb-2">{reward.num} Referrals</p>
                  <p className="text-3xl font-bold text-red-600 mb-2">{reward.bonus}</p>
                  <p className="text-sm text-gray-500">{reward.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="p-6 border-yellow-200 bg-yellow-50">
            <p className="text-sm text-gray-700">💎 <strong>Diamond Package Requirement:</strong> Bonuses are only awarded when you achieve referrals at the Diamond Package ($999). Lower tier packages do not count toward bonus milestones.</p>
          </GlassCard>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block text-sm font-semibold text-blue-600 mb-3">
              OUR STORY
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The Vision Behind HostingPro</h2>
          </div>

          <GlassCard className="p-8 md:p-12">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                The vision for HostingPro emerged from a simple but powerful idea: <strong>everyone deserves the opportunity to make money</strong>. We believe that financial freedom shouldn't be reserved for the few—it should be accessible to anyone willing to take action.
              </p>

              <p className="text-lg">
                Traditional affiliate programs require you to wait months for commissions and deal with endless bureaucracy. We asked ourselves: what if there was a better way? What if you could earn <strong>daily passive income</strong> by leveraging digital infrastructure that's already in demand?
              </p>

              <p className="text-lg">
                That's why we created the daily hosting rental model. Rather than waiting for annual commissions, you get paid every single day. With 70% commission from your very first referral, you're in profit after just 2 sales — and it only gets better from there. It's transparent, it's immediate, and it's designed to reward your efforts fairly.
              </p>

              <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded-r-lg">
                <p className="text-lg font-semibold text-slate-900 mb-2">Building With AI—The Right Way</p>
                <p>
                  Developing HostingPro required more than just using AI to generate code. We leveraged AI to handle the mundane details—database architecture, payment integrations, email automation—but we didn't let AI make the strategic decisions. This platform required human judgment, testing, refinement, and iteration. We worked through multiple AI models, debugged countless issues, and refined every feature until it matched our vision of a truly fair affiliate system.
                </p>
              </div>

              <p className="text-lg">
                The truth is, building this took real work. We had to ensure every transaction was tracked, every payout was accurate, and every affiliate felt valued. We tested different approaches, learned what worked and what didn't, and built something that genuinely works.
              </p>

              <p className="text-lg font-semibold text-slate-900">
                HostingPro isn't just an affiliate program—it's a system built on the belief that when you succeed, we all thrive together. Join us and start earning the daily income you deserve.
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Why HostingPro */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Why HostingPro?</h2>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: '📨', title: 'Daily Payouts', desc: 'No monthly waiting periods. Get paid instantly to PayPal every single day.' },
              { icon: '🔍', title: 'Transparent Pricing', desc: '70% of every sale goes directly to you. No hidden fees, no admin cuts. Simple and honest.' },
              { icon: '⚡', title: 'Quick Setup', desc: 'Get started in minutes. No complicated forms, no long waits for approval.' },
              { icon: '📈', title: 'Unlimited Earnings', desc: 'The more referrals you get, the more you earn. There\'s no cap on your income.' }
            ].map((feature) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="p-8 bg-slate-900 text-white mb-8">
            <h3 className="text-2xl font-bold mb-4">Commission Structure</h3>
            <p className="mb-4">70% commission from your very first referral. Hit 10 referrals and earn 75% forever.</p>
            <p className="text-gray-300">No admin fees. No splits. Just a straight 70% (or 75% for elite performers) paid directly to your PayPal every single day. In profit after just 2 referrals!</p>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { title: 'Automated & Transparent', desc: 'Everything is set and forget. Your email campaigns run automatically, your sales are tracked in real-time, and you get paid daily without lifting a finger.' },
              { title: 'Automated Email Responder', desc: 'Your email campaigns run 24/7 completely on autopilot. Set it up once and watch your leads convert while you sleep. Zero manual work required.' }
            ].map((item) => (
              <GlassCard key={item.title} className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </GlassCard>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Link Tracking Built-In', desc: 'Add tracking parameters to your affiliate links to see exactly where your traffic comes from. Know every sale source and never get ripped off.' },
              { title: 'Maximum Earning Potential', desc: '70% of every sale paid daily to you — 75% once you hit 10 referrals. In profit after just 2 referrals. Everyone likes money, and this system delivers it.' }
            ].map((item) => (
              <GlassCard key={item.title} className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Here's The Real Talk */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Here's The Real Talk</h2>
          <p className="text-lg mb-6 text-gray-300">If you're not getting traffic, you're either promoting it wrong or in the wrong places. There's not one person in this world who doesn't like money.</p>
          <p className="text-lg mb-8 text-gray-300">If you don't like money, you're in the wrong place. But if you do—and we know you do—then you have everything you need to succeed:</p>
          <ul className="space-y-3 text-gray-300 mb-8">
            <li>✓ 70% commission paid daily (75% at 10+ referrals)</li>
            <li>✓ Automated email campaigns doing the work for you</li>
            <li>✓ Full tracking transparency</li>
            <li>✓ Complete guides in your back office</li>
          </ul>
          <p className="text-lg text-gray-300">The opportunity is here. The question is: are you ready to take it?</p>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {blogPosts.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Blog Posts</h2>
              <p className="text-xl text-gray-600">Tips, strategies, and insights to help you maximize your earnings</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {blogPosts.map((post) => {
                const categoryColors = {
                  tutorials: 'bg-blue-100 text-blue-700',
                  tips: 'bg-red-100 text-red-700',
                  news: 'bg-white border-2 border-slate-900 text-slate-900',
                  'case-studies': 'bg-blue-50 text-blue-600',
                  resources: 'bg-red-50 text-red-600'
                };
                const bgColor = categoryColors[post.category] || 'bg-blue-100 text-blue-700';
                return (
                  <GlassCard key={post.id} className="p-6 flex flex-col bg-gradient-to-br from-red-50 to-white">
                    <div className={`inline-block ${bgColor} px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit`}>
                      {post.category}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">{post.excerpt}</p>
                    <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)} className="text-red-600 font-semibold text-sm hover:underline">Read More →</Link>
                  </GlassCard>
                );
              })}
            </div>

            <div className="text-center">
              <Link to={createPageUrl('Blog')} className="text-red-600 font-semibold hover:underline">View All Articles →</Link>
              <div className="mt-4">
                <Link to={createPageUrl(`Packages${referralCode ? `?ref=${referralCode}` : ''}`)} className="inline-block">
                  <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white rounded-xl">
                    Ready to Get Started? View Packages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Refund Policy */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Our Refund Policy</h2>

          <div className="space-y-6">
            <GlassCard className="p-6 border-red-200 bg-red-50">
              <h3 className="font-bold text-slate-900 mb-3">STRICTLY NO REFUNDS</h3>
              <p className="text-gray-700 text-sm">Once you have obtained 2 referrals and have received at least one payout, your initial package purchase is considered final and non-refundable under any circumstances. This policy ensures the integrity of the affiliate program and prevents abuse of the commission structure.</p>
            </GlassCard>

            <GlassCard className="p-6 border-green-200 bg-green-50">
              <h3 className="font-bold text-slate-900 mb-3">Pre-Referral Refund Option</h3>
              <p className="text-gray-700 text-sm mb-3">If you have not yet received your 2 referrals within the timeframe you expected, you may request a full refund of your package purchase—no hard feelings, we tried! If you have followed all program rules and guidelines, we will process your refund request.</p>
              <p className="text-gray-700 text-sm">For refund requests or any questions, please email our support team at <a href="mailto:support@rentapog.com" className="text-green-600 font-semibold">support@rentapog.com</a></p>
            </GlassCard>

            <GlassCard className="p-6 border-yellow-200 bg-yellow-50">
              <h3 className="font-bold text-slate-900 mb-3">PayPal Dispute Policy</h3>
              <p className="text-gray-700 text-sm">Please do not file PayPal disputes. We utilize PayPal as our payment processor specifically because of their industry-leading fair trading policies and buyer protection. Every transaction is fully tracked and transparent in our admin dashboard. If you have any concerns about a payment or transaction, please contact our support team directly. Filing unauthorized disputes may result in immediate account suspension, as we operate with complete transparency and fairness.</p>
            </GlassCard>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">⚠️ No one will be credited for this signup. Please use a referral link to ensure proper credit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Get Started Today</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">Fill out the form and we'll get back to you shortly.</p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                />
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Get Started
              </Button>
            </form>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
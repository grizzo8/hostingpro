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
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block text-sm font-semibold text-blue-600 mb-3">
              Pay Once → Get 3 Referrals → Earn Daily Forever
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How HostingPro Works</h2>
            <p className="text-xl text-gray-600">A simple 3-step system to build daily passive income. The higher you invest, the more you earn!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: 1,
                title: 'Choose Your Hosting Package',
                desc: 'Select your hosting package ($20-$999). Make one payment to get started. Your payment goes to admin as the platform fee, and you receive your affiliate link via email.',
                badge: '⏱️ One-time payment only'
              },
              {
                num: 2,
                title: 'Get 3 Referrals',
                desc: 'Share your unique referral link with 3 people. When they sign up and pay, you\'ve doubled your money! Your 1st sale = 100% yours, 2nd sale = admin, 3rd+ sales = 100% yours.',
                badge: '💰 Double your money at 3 referrals'
              },
              {
                num: 3,
                title: 'Earn Daily Passive Income',
                desc: 'Once you hit 3 referrals, daily billing activates. Every single day, you receive automatic PayPal payments from new sales. The higher your package, the more you earn daily!',
                badge: '📈 Automatic daily PayPal payouts'
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
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Fair & Transparent Payment System</h2>
            <p className="text-xl text-gray-600">Here's exactly how commissions are split. Simple, clear, and designed for your success.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { num: 1, title: '1st Sale - You Get 100%', desc: 'Your first referral sale goes directly to you. This helps you recoup your initial investment faster.', label: '100% to you' },
              { num: 2, title: '2nd Sale - Admin Fee', desc: 'Your second sale always goes to admin to cover platform costs and support.', label: 'Goes to admin' },
              { num: 3, title: '3rd+ Sales - You Get 100%', desc: 'All sales after the 2nd go to YOU! This is where you start making serious passive income daily.', label: '100% to you forever' }
            ].map((item) => (
              <motion.div key={item.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-6">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {item.num}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{item.desc}</p>
                  <p className="text-green-600 font-semibold text-sm">{item.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-8 bg-green-50 border-green-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">💰 Double Your Money System</h3>
              <p className="text-gray-700 text-sm mb-4">With just 3 referrals, you've already doubled your initial investment! Once you hit 3 referrals, daily billing activates and you start earning passive income every single day via PayPal.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Pay once upfront</li>
                <li>✓ Get 3 referrals = 2x ROI</li>
                <li>✓ Daily passive income</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">📈 Higher Package = More Daily Income</h3>
              <p className="text-gray-700 text-sm">The beauty of this system: the higher package you choose, the more passive income you earn daily once you hit 3 referrals. It's all automated through PayPal!</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bronze</span>
                  <span className="font-bold text-slate-900">$49/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gold</span>
                  <span className="font-bold text-slate-900">$299/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Diamond</span>
                  <span className="font-bold text-slate-900">$999/day</span>
                </div>
              </div>
            </GlassCard>
          </div>
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
                That's why we created the daily hosting rental model. Rather than waiting for annual commissions, you get paid every single day. The moment you hit 3 referrals, the income starts flowing automatically to your PayPal account. It's transparent, it's immediate, and it's designed to reward your efforts fairly.
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
              { icon: '🔍', title: 'Transparent Pricing', desc: 'Only your 2nd sale goes to admin. You keep 100% of the rest. Period.' },
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
            <h3 className="text-2xl font-bold mb-4">Payment Structure</h3>
            <p className="mb-4">Your 1st and 3rd+ Referrals = 100% Yours</p>
            <p className="text-gray-300">Your payment covers the admin fee. 1st referral sale = 100% yours. 2nd sale = admin. All others = 100% yours forever!</p>
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
              { title: 'Maximum Earning Potential', desc: '100% of subscription fees paid daily to you. If you\'re not getting traffic, you\'re marketing wrong or in the wrong places. But here\'s the truth: everyone likes money.' }
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
            <li>✓ 100% commission paid daily</li>
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
              <p className="text-gray-700 text-sm">Once you have obtained 3 referrals and have received at least one payout, your initial package purchase is considered final and non-refundable under any circumstances. This policy ensures the integrity of the affiliate program and prevents abuse of the commission structure.</p>
            </GlassCard>

            <GlassCard className="p-6 border-green-200 bg-green-50">
              <h3 className="font-bold text-slate-900 mb-3">Pre-Referral Refund Option</h3>
              <p className="text-gray-700 text-sm mb-3">If you have not yet received your 3 referrals within the timeframe you expected, you may request a full refund of your package purchase—no hard feelings, we tried! If you have followed all program rules and guidelines, we will process your refund request.</p>
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
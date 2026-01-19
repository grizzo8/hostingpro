import React, { useState, useEffect } from "react";
import { Mail, Share2, Image, Video, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";

export default function MarketingMaterials() {
    const [copied, setCopied] = useState(null);
    const [userLink, setUserLink] = useState("[YOUR_LINK]");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserLink();
    }, []);

    const loadUserLink = async () => {
        try {
            const user = await base44.auth.me();
            const affiliate = await base44.entities.Affiliate.filter({ user_email: user.email });
            if (affiliate[0]) {
                const link = `https://hostingpro.com/ref/${affiliate[0].referral_code}`;
                setUserLink(link);
            }
        } catch (error) {
            console.error("Error loading link:", error);
            setUserLink("https://hostingpro.com");
        } finally {
            setLoading(false);
        }
    };

    const emailTemplates = [
        {
            subject: "Join Me & Start Earning Daily Passive Income",
            body: `Hi there!

I've been looking for a legitimate way to build passive income, and I found something that actually works: HostingPro.

Here's the deal:
- Pay once upfront for a hosting package
- Get just 3 referrals
- Start earning daily payouts via PayPal for life

The best part? It's completely transparent. Your 1st and 3rd+ sales go to YOU. Only the 2nd sale covers admin fees.

Interested? Check it out: ${userLink}

Let me know if you have questions!`
        },
        {
            subject: "This Changed My Passive Income Game",
            body: `Hey!

I wanted to share something that's been working really well for me.

HostingPro is a hosting affiliate program that actually pays you daily. Not monthly, DAILY. Here's how:

1. You buy a package once
2. You refer 3 people
3. You earn passive income every single day

Higher packages = higher daily earnings. It's simple, transparent, and automated.

${userLink}

Would love to see you on the team!`
        },
        {
            subject: "Turn Your Network Into Daily Income",
            body: `Hi!

Quick question: Want to turn your social network into a daily income stream?

I'm using HostingPro and it's been solid. You get:
✓ Daily PayPal payouts (no waiting 30+ days)
✓ 100% commission on your 1st and 3rd+ sales
✓ Unlimited earning potential

Your link: ${userLink}

Let's build this together!`
        }
    ];

    const socialPosts = [
        {
            platform: "LinkedIn",
            text: "Just hit 10 referrals with HostingPro. The daily passive income is real. If you're curious about building a second income stream, DM me. 💰"
        },
        {
            platform: "Twitter",
            text: "Started with HostingPro 2 months ago. First 3 referrals = ROI. Now earning daily PayPal payments. Who else is building passive income? 🚀"
        },
        {
            platform: "Facebook",
            text: "I found a hosting affiliate program that actually pays daily. Not some MLM scam - just real daily PayPal transfers. Happy to share more if interested."
        },
        {
            platform: "Instagram",
            text: "Daily passive income hits different 💰 HostingPro changed my money mindset. DM for my link if interested! 📈"
        },
        {
            platform: "TikTok",
            text: "POV: You're earning daily passive income with HostingPro 💵 Get 3 referrals and watch the PayPal notifications roll in ✨"
        }
    ];

    const videoScripts = [
        {
            title: "YouTube Short (30-60 seconds)",
            script: `"So I found this hosting affiliate program that pays you DAILY. Here's how it works:

Step 1: Buy a hosting package ($99-$999)
Step 2: Get 3 referrals
Step 3: Start earning daily PayPal payments

Your first sale = 100% to you. Second sale covers admin. Everything after = 100% to you forever.

The higher the package, the more you earn daily. Some people are making $300+ per day just from referrals.

Want to build passive income? ${userLink}"`
        },
        {
            title: "TikTok Trend Hook (15-30 seconds)",
            script: `*Shows PayPal notification of daily earnings*

"This is me earning daily passive income with HostingPro. No, it's not fake. No, it's not an MLM. 

You literally just get 3 referrals and the money comes in every day to PayPal.

${userLink}"`
        },
        {
            title: "Instagram Reel (30-60 seconds)",
            script: `"Here's how I built a daily passive income stream in 2 months:

1. Invested in a hosting package ($299)
2. Shared my link with friends and on social
3. Got 3 referrals in the first month
4. Started earning $150/day 

Now I'm at 15 referrals and making $2,000+ monthly just from daily PayPal payments.

It's transparent, it's real, and it works. DM if you want details."`
        }
    ];

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Marketing Materials</h2>
                <p className="text-gray-600">Proven templates to help you promote HostingPro</p>
            </div>

            <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Social</span>
                    </TabsTrigger>
                    <TabsTrigger value="banners" className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        <span className="hidden sm:inline">Banners</span>
                    </TabsTrigger>
                    <TabsTrigger value="scripts" className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span className="hidden sm:inline">Scripts</span>
                    </TabsTrigger>
                </TabsList>

                {/* Email Templates */}
                <TabsContent value="email" className="space-y-4">
                    {emailTemplates.map((template, idx) => (
                        <Card key={idx} className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base">Email Template {idx + 1}</CardTitle>
                                <p className="text-sm text-gray-600 mt-2">Subject: {template.subject}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs mb-4 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {template.body}
                                </div>
                                <Button
                                    onClick={() => handleCopy(`Subject: ${template.subject}\n\n${template.body}`, `email-${idx}`)}
                                    className={`w-full ${copied === `email-${idx}` ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    size="sm"
                                >
                                    {copied === `email-${idx}` ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Template
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Social Media Posts */}
                <TabsContent value="social" className="space-y-4">
                    {socialPosts.map((post, idx) => (
                        <Card key={idx} className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base">{post.platform}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm leading-relaxed">
                                    {post.text}
                                </div>
                                <Button
                                    onClick={() => handleCopy(post.text, `social-${idx}`)}
                                    className={`w-full ${copied === `social-${idx}` ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    size="sm"
                                >
                                    {copied === `social-${idx}` ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Post
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Banner Templates */}
                <TabsContent value="banners">
                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle>Ready-to-Use Banners</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-700 mb-4">
                                Professional banner designs for your promotions. You can use these directly or customize them.
                            </p>
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                    <p className="text-sm font-semibold mb-2">Leaderboard (728x90)</p>
                                    <div className="relative bg-gradient-to-r from-blue-700 to-red-600 rounded-lg p-3 flex items-center justify-between" style={{height: '70px'}}>
                                        <div className="text-white font-bold">💰 HostingPro - Daily PayPal Payouts</div>
                                        <button className="bg-white text-blue-600 px-4 py-1 rounded-full font-bold text-sm">Join Now →</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-3 border border-blue-200">
                                    <p className="text-sm font-semibold mb-2">Medium Rectangle (300x250)</p>
                                    <div className="relative bg-gradient-to-br from-blue-600 to-red-600 rounded-lg p-4 text-center" style={{width: '280px'}}>
                                        <p className="text-white font-bold text-lg mb-2">HostingPro</p>
                                        <p className="text-yellow-300 text-xs font-bold mb-3">💵 Earn $100-$300/Day</p>
                                        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm">Start Now →</button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Video Scripts */}
                <TabsContent value="scripts" className="space-y-4">
                    {videoScripts.map((item, idx) => (
                        <Card key={idx} className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-base">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs mb-4 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {item.script}
                                </div>
                                <Button
                                    onClick={() => handleCopy(item.script, `script-${idx}`)}
                                    className={`w-full ${copied === `script-${idx}` ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    size="sm"
                                >
                                    {copied === `script-${idx}` ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Script
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
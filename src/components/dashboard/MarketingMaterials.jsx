import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, Mail, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';

export default function MarketingMaterials({ affiliate }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const materials = [
    {
      id: 'email1',
      name: 'Welcome Email Template',
      description: 'Email to introduce HostingPro to your list',
      icon: Mail,
      content: `Subject: Try This Amazing Hosting Program (100% Commission!)

Hi there,

I wanted to share something I've been using that's been great for passive income - HostingPro's affiliate program.

Here's why it's different:
- Get your 1st & 3rd+ sales at 100% commission
- Daily PayPal payouts once you hit 3 referrals
- Zero ongoing fees or requirements

Your link: https://hostingpro.com/ref/${affiliate?.referral_code || 'YOUR_CODE'}

Best,
${affiliate?.full_name || 'Your Name'}`
    },
    {
      id: 'email2',
      name: 'Value Proposition Email',
      description: 'Highlight the earning potential',
      icon: Mail,
      content: `Subject: Turn 3 Sales Into Daily Income

Hey,

Quick question - would you like to earn $20-$100+ daily?

HostingPro's affiliate program lets you:
✓ Get 100% commission on your 1st sale
✓ Have 2nd sale cover your costs
✓ Earn 100% commission on all sales after that
✓ Get daily PayPal payouts starting day 1

Join here: https://hostingpro.com/ref/${affiliate?.referral_code || 'YOUR_CODE'}

Talk soon!`
    },
    {
      id: 'social1',
      name: 'Social Media Post',
      description: 'Share on Twitter, LinkedIn, Facebook',
      icon: Image,
      content: `🔥 Just discovered an affiliate program that actually pays OUT:

• 100% commission on my 1st & 3rd+ sales
• Daily PayPal payouts
• $2-$100+ daily depending on package
• ZERO ongoing costs

This is the deal I've been looking for. If you're interested: https://hostingpro.com/ref/${affiliate?.referral_code || 'YOUR_CODE'}`
    },
    {
      id: 'swipe1',
      name: 'Swipe Copy - The Pitch',
      description: 'Direct copy-paste sales message',
      icon: FileText,
      content: `Ready to start earning daily passive income?

HostingPro is different. Here's how:

STEP 1: Join with a hosting package ($19.95 - $999)
STEP 2: Get 3 paying referrals (100% commission)
STEP 3: Earn $2-$100+ DAILY with our automatic payout system

Your package size = Your daily earnings

Join now: https://hostingpro.com/ref/${affiliate?.referral_code || 'YOUR_CODE'}

This is real, recurring income. No cap. No limits.`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Referral Link</h3>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <input
            type="text"
            value={`https://hostingpro.com/ref/${affiliate?.referral_code || ''}`}
            readOnly
            className="flex-1 bg-transparent border-none text-slate-900 font-mono text-sm"
          />
          <Button
            size="sm"
            onClick={() => copyToClipboard(`https://hostingpro.com/ref/${affiliate?.referral_code}`, 'link')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </GlassCard>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Marketing Templates</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {materials.map((material) => {
            const Icon = material.icon;
            return (
              <GlassCard key={material.id} className="p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{material.name}</p>
                    <p className="text-sm text-gray-500">{material.description}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-1 max-h-40 overflow-y-auto text-sm text-gray-700 border border-gray-200">
                  {material.content}
                </div>
                <Button
                  onClick={() => copyToClipboard(material.content, material.id)}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  variant="outline"
                >
                  {copied === material.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Template
                    </>
                  )}
                </Button>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <GlassCard className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>✓ Share your link on social media, email, and forums where your audience hangs out</li>
          <li>✓ Personalize templates with your own story about why you chose HostingPro</li>
          <li>✓ Track which channels bring your best referrals and double down on them</li>
          <li>✓ The key is getting 3 referrals quickly - then let daily payouts take over</li>
        </ul>
      </GlassCard>
    </motion.div>
  );
}
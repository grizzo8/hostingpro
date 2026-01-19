import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-700">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm">
                By accessing and using HostingPro ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
              <p className="text-sm mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on HostingPro's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on HostingPro's website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Affiliate Program Terms</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Eligibility</h3>
                  <p>You must be at least 18 years old and legally capable of entering into binding contracts to participate in our affiliate program.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Account Registration</h3>
                  <p>You agree to provide accurate, current, and complete information during registration and to maintain and update such information as necessary.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Prohibited Activities</h3>
                  <p>You agree not to engage in fraud, misleading advertising, spamming, or any illegal activities. Violations may result in immediate account termination.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Commission Structure</h3>
                  <p>Commissions are calculated and paid according to the structure displayed on our website. We reserve the right to modify commission rates with 30 days' notice.</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Payment Terms</h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Initial Purchase:</strong> Your payment for hosting packages is final and non-refundable once you have received 3 referrals and at least one payout.
                </p>
                <p>
                  <strong>Commissions:</strong> All commissions are processed and paid via PayPal to the email address you provide. Payments are made daily upon approval of referrals.
                </p>
                <p>
                  <strong>PayPal Fees:</strong> PayPal transaction fees are the responsibility of the affiliate and will be deducted from payout amounts.
                </p>
                <p>
                  <strong>Dispute Resolution:</strong> All payment disputes must be resolved through our support team. Do not file PayPal disputes without contacting us first.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Refund Policy</h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>No Refunds After Payout:</strong> Once you have received 3 referrals and received at least one payout, your initial package purchase is considered final and non-refundable under any circumstances.
                </p>
                <p>
                  <strong>Pre-Payout Refunds:</strong> If you have not received 3 referrals within your expected timeframe and have followed all program rules, you may request a full refund.
                </p>
                <p>
                  <strong>Refund Requests:</strong> Contact support@hostingpro.com to request a refund.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Disclaimer of Warranties</h2>
              <p className="text-sm">
                The materials on HostingPro's website are provided on an "as is" basis. HostingPro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitations of Liability</h2>
              <p className="text-sm">
                In no event shall HostingPro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on HostingPro's website, even if HostingPro or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Accuracy of Materials</h2>
              <p className="text-sm">
                The materials appearing on HostingPro's website could include technical, typographical, or photographic errors. HostingPro does not warrant that any of the materials on its website are accurate, complete, or current. HostingPro may make changes to the materials contained on its website at any time without notice.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Links</h2>
              <p className="text-sm">
                HostingPro has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by HostingPro of the site. Use of any such linked website is at the user's own risk.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Modifications</h2>
              <p className="text-sm">
                HostingPro may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law</h2>
              <p className="text-sm">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where HostingPro operates, and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Account Termination</h2>
              <p className="text-sm mb-4">
                HostingPro reserves the right to terminate your account if you:
              </p>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Violate any terms of this agreement</li>
                <li>Engage in fraudulent activity</li>
                <li>Violate applicable laws</li>
                <li>Engage in spamming or unethical marketing practices</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Information</h2>
              <p className="text-sm">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-sm mt-4">
                <strong>Email:</strong> support@hostingpro.com
              </p>
            </GlassCard>

            <div className="text-sm text-gray-600 text-center">
              <p>Last Updated: January 19, 2026</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
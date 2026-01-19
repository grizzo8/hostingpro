import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import GlassCard from '@/components/ui/GlassCard';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-700">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to HostingPro ("we," "us," "our," or "Company"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Services.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Personal Information</h3>
                  <p className="text-sm">
                    We collect information you voluntarily provide, including:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Full name and email address</li>
                    <li>PayPal email for payouts</li>
                    <li>Website URL and contact information</li>
                    <li>Phone number and company details</li>
                    <li>Payment and billing information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Automatically Collected Information</h3>
                  <p className="text-sm">
                    When you use our Services, we automatically collect:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>IP address and browser type</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referral source and device information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-sm mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Process your affiliate account and payments</li>
                <li>Send you important updates about the affiliate program</li>
                <li>Calculate commissions and process payouts</li>
                <li>Prevent fraud and improve security</li>
                <li>Analyze usage patterns to improve our Services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Information Sharing</h2>
              <p className="text-sm mb-4">
                We do not sell, trade, or rent your personal information. We may share information with:
              </p>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li><strong>Payment Processors:</strong> PayPal and other payment providers for transaction processing</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in our operations</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-sm mb-4">
                We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-sm">
                We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and understand how you use our Services. You can control cookie settings through your browser, though this may limit some functionality of our website.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
              <p className="text-sm mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Third-Party Links</h2>
              <p className="text-sm">
                Our website may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any information.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
              <p className="text-sm">
                Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete such information.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Us</h2>
              <p className="text-sm">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="text-sm mt-4">
                <strong>Email:</strong> privacy@hostingpro.com<br/>
                <strong>Address:</strong> HostingPro, Inc.
              </p>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the "Last Updated" date. Your continued use of our Services indicates your acceptance of the updated Privacy Policy.
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
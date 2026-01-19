import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Zap, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-red-200 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">HostingPro</span>
            </div>
            <p className="text-gray-600 text-sm">
              The most rewarding hosting affiliate program. Start earning today.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Affiliates</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link to={createPageUrl('AffiliateSignup')} className="hover:text-red-600 transition-colors">Join Program</Link></li>
              <li><Link to={createPageUrl('AffiliateDashboard')} className="hover:text-red-600 transition-colors">Dashboard</Link></li>
              <li><Link to={createPageUrl('Packages')} className="hover:text-red-600 transition-colors">Packages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link to={createPageUrl('Blog')} className="hover:text-red-600 transition-colors">Blog</Link></li>
              <li><Link to={createPageUrl('About')} className="hover:text-red-600 transition-colors">About Us</Link></li>
              <li><Link to={createPageUrl('Contact')} className="hover:text-red-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-red-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} HostingPro. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link to={createPageUrl('PrivacyPolicy')} className="hover:text-red-600 transition-colors">Privacy Policy</Link>
            <Link to={createPageUrl('TermsOfService')} className="hover:text-red-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
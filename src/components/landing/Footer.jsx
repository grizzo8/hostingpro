import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Zap, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HostingPro</span>
            </div>
            <p className="text-gray-400 text-sm">
              The most rewarding hosting affiliate program. Start earning today.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Affiliates</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to={createPageUrl('AffiliateSignup')} className="hover:text-white transition-colors">Join Program</Link></li>
              <li><Link to={createPageUrl('AffiliateDashboard')} className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to={createPageUrl('Packages')} className="hover:text-white transition-colors">Packages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to={createPageUrl('Blog')} className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to={createPageUrl('About')} className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to={createPageUrl('Contact')} className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} HostingPro. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
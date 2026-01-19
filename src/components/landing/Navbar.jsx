import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [referralCode, setReferralCode] = useState(null);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, []);

  const getPackagesUrl = () => {
    return createPageUrl(`Packages${referralCode ? `?ref=${referralCode}` : ''}`);
  };

  const navLinks = [
    { name: 'Packages', href: 'packages-dynamic' },
    { name: 'Blog', href: createPageUrl('Blog') },
    { name: 'About', href: createPageUrl('About') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            {/* Australian Flag */}
            <div className="absolute top-2 right-6 flex flex-col items-center">
              <span className="text-lg">🇦🇺</span>
              <span className="text-xs font-bold text-red-600 leading-none">MADE</span>
            </div>
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">HostingPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.name === 'Packages' ? getPackagesUrl() : link.href}
                className="text-gray-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link to={createPageUrl(user.role === 'admin' ? 'AdminDashboard' : 'AffiliateDashboard')}>
                <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white rounded-xl">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to={createPageUrl('AffiliateSignup')}>
                   <Button variant="ghost" className="text-gray-600 hover:text-slate-900 hover:bg-gray-100">
                    Sign Up
                  </Button>
                </Link>
                <Link to={createPageUrl('AffiliateDashboard')}>
                  <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white rounded-xl">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
           <button
             className="md:hidden text-slate-900 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-red-200"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.name === 'Packages' ? getPackagesUrl() : link.href}
                    className="block text-gray-600 hover:text-red-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-red-200 space-y-2">
                <Link to={createPageUrl('AffiliateSignup')} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    Sign Up
                  </Button>
                </Link>
                <Link to={createPageUrl('AffiliateDashboard')} onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
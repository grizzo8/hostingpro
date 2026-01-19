import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Link2, 
  DollarSign, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

export default function DashboardSidebar({ onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', href: createPageUrl('AffiliateDashboard'), icon: LayoutDashboard },
    { name: 'Referral Links', href: createPageUrl('AffiliateLinks'), icon: Link2 },
    { name: 'Commissions', href: createPageUrl('AffiliateCommissions'), icon: DollarSign },
    { name: 'Referrals', href: createPageUrl('AffiliateReferrals'), icon: Users },
    { name: 'Performance', href: createPageUrl('AffiliatePerformance'), icon: BarChart3 },
    { name: 'Messages', href: createPageUrl('AffiliateMessages'), icon: MessageSquare },
    { name: 'Settings', href: createPageUrl('AffiliateSettings'), icon: Settings },
  ];

  const isActive = (href) => {
    const pageName = href.split('/').pop().replace('.jsx', '');
    return currentPath.includes(pageName);
  };

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 min-h-screen flex flex-col">
      <div className="p-6">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">HostingPro</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white border border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
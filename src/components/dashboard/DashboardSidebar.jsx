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
    <aside className="w-64 bg-white border-r border-red-600/30 min-h-screen flex flex-col">
      <div className="p-6">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">HostingPro</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.href)
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-red-600/20">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
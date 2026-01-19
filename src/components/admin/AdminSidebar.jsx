import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  DollarSign, 
  FileText, 
  UserCheck, 
  MessageSquare, 
  Settings, 
  LogOut,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function AdminSidebar({ onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', href: createPageUrl('AdminDashboard'), icon: LayoutDashboard },
    { name: 'Affiliates', href: createPageUrl('AdminAffiliates'), icon: Users },
    { name: 'Packages', href: createPageUrl('AdminPackages'), icon: Package },
    { name: 'Payouts', href: createPageUrl('AdminPayouts'), icon: DollarSign },
    { name: 'Blog Posts', href: createPageUrl('AdminBlog'), icon: FileText },
    { name: 'Leads (CRM)', href: createPageUrl('AdminLeads'), icon: UserCheck },
    { name: 'Messages', href: createPageUrl('AdminMessages'), icon: MessageSquare },
  ];

  const isActive = (href) => {
    const pageName = href.split('/').pop().replace('.jsx', '');
    return currentPath.includes(pageName);
  };

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 min-h-screen flex flex-col">
      <div className="p-6">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">HostingPro</span>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-white/10'
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
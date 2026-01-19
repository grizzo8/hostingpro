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
    <aside className="w-64 bg-white border-r border-red-200 min-h-screen flex flex-col">
      <div className="p-6">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900">HostingPro</span>
            <p className="text-xs text-gray-600">Admin Panel</p>
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
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-red-200">
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
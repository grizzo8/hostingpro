import React from 'react';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader({ user, affiliate, onMenuToggle }) {
  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };
  return (
    <header className="h-20 bg-white border-b border-red-600/30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-900"
          onClick={onMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="w-64 bg-gray-50 border-gray-200 pl-10 text-slate-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-slate-900 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-slate-900 text-sm font-medium">{user?.full_name}</p>
                <p className="text-gray-600 text-xs capitalize">{affiliate?.tier || 'bronze'} tier</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-200">
            <DropdownMenuItem className="text-gray-700 hover:text-slate-900 focus:text-slate-900 focus:bg-gray-50">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:text-slate-900 focus:text-slate-900 focus:bg-gray-50">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:text-slate-900 focus:text-slate-900 focus:bg-gray-50">
              Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 focus:text-red-700 focus:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
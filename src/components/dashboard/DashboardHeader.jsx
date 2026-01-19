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
    <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white"
          onClick={onMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="w-64 bg-white/5 border-white/10 pl-10 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-white/5 rounded-xl p-2 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{user?.full_name}</p>
                <p className="text-gray-400 text-xs capitalize">{affiliate?.tier || 'bronze'} tier</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
            <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
              Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
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
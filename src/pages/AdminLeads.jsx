import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { UserCheck, Search, Filter, Plus, Phone, Mail, Building, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  contacted: { label: 'Contacted', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  qualified: { label: 'Qualified', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  converted: { label: 'Converted', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  lost: { label: 'Lost', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' }
};

export default function AdminLeads() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    interested_package: '',
    notes: ''
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AdminLeads'));
        return;
      }
      const userData = await base44.auth.me();
      if (userData.role !== 'admin') {
        window.location.href = createPageUrl('AffiliateDashboard');
        return;
      }
      setUser(userData);
    };
    checkAuth();
  }, []);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['all-leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 100)
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const createLeadMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Lead.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-leads']);
      setDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'website',
        interested_package: '',
        notes: ''
      });
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await base44.entities.Lead.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-leads']);
    }
  });

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSearch = !search || 
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onLogout={handleLogout} />
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader 
          user={user} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Leads (CRM)</h1>
                <p className="text-gray-400">Manage and track potential customers.</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Lead</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Company</Label>
                        <Input
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Source</Label>
                      <Select
                        value={formData.source}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
                      >
                        <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Notes</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-1 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <Button
                      onClick={() => createLeadMutation.mutate()}
                      disabled={createLeadMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      Add Lead
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={UserCheck}
                label="New Leads"
                value={newLeads}
                delay={0.1}
              />
              <StatCard
                icon={Phone}
                label="Contacted"
                value={contactedLeads}
                delay={0.2}
              />
              <StatCard
                icon={UserCheck}
                label="Converted"
                value={convertedLeads}
                delay={0.3}
              />
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search by name, email or company..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </GlassCard>
            </motion.div>

            {/* Leads Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Lead</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Source</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            No leads found
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white font-medium">{lead.name || 'N/A'}</p>
                                {lead.company && (
                                  <p className="text-gray-400 text-sm flex items-center gap-1">
                                    <Building className="w-3 h-3" /> {lead.company}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="text-gray-300 flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {lead.email}
                                </p>
                                {lead.phone && (
                                  <p className="text-gray-400 text-sm flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {lead.phone}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className="bg-white/10 text-gray-300 capitalize">
                                {lead.source}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Select
                                value={lead.status}
                                onValueChange={(status) => updateLeadMutation.mutate({ id: lead.id, data: { status } })}
                              >
                                <SelectTrigger className="w-32 bg-transparent border-none p-0 h-auto">
                                  <Badge className={`border ${statusConfig[lead.status]?.color}`}>
                                    {statusConfig[lead.status]?.label}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                  {Object.entries(statusConfig).map(([key, val]) => (
                                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {format(new Date(lead.created_date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                                  <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10">
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => updateLeadMutation.mutate({ 
                                      id: lead.id, 
                                      data: { last_contacted: new Date().toISOString() } 
                                    })}
                                    className="text-gray-300 hover:text-white focus:text-white focus:bg-white/10"
                                  >
                                    Mark as Contacted
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
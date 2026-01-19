import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Package, Plus, Pencil, Trash2, GripVertical, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from "@/components/ui/badge";

export default function AdminPackages() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    features: [],
    monthly_price: 0,
    yearly_price: 0,
    commission_rate: 30,
    recurring_commission: true,
    is_popular: false,
    is_active: true,
    sort_order: 0
  });
  const [newFeature, setNewFeature] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('AdminPackages'));
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

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: () => base44.entities.HostingPackage.list('sort_order', 50)
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingPackage) {
        await base44.entities.HostingPackage.update(editingPackage.id, formData);
      } else {
        await base44.entities.HostingPackage.create(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-packages']);
      setDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.HostingPackage.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-packages']);
    }
  });

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      features: [],
      monthly_price: 0,
      yearly_price: 0,
      commission_rate: 30,
      recurring_commission: true,
      is_popular: false,
      is_active: true,
      sort_order: 0
    });
    setNewFeature('');
  };

  const openEditDialog = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name || '',
      slug: pkg.slug || '',
      description: pkg.description || '',
      features: pkg.features || [],
      monthly_price: pkg.monthly_price || 0,
      yearly_price: pkg.yearly_price || 0,
      commission_rate: pkg.commission_rate || 30,
      recurring_commission: pkg.recurring_commission ?? true,
      is_popular: pkg.is_popular ?? false,
      is_active: pkg.is_active ?? true,
      sort_order: pkg.sort_order || 0
    });
    setDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

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
                <h1 className="text-3xl font-bold text-white mb-2">Packages</h1>
                <p className="text-gray-400">Manage hosting packages and commission rates.</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Package
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingPackage ? 'Edit Package' : 'Create Package'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Package Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Slug</Label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                          placeholder="e.g. starter, business"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1 bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Monthly Price ($)</Label>
                        <Input
                          type="number"
                          value={formData.monthly_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, monthly_price: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Yearly Price ($)</Label>
                        <Input
                          type="number"
                          value={formData.yearly_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, yearly_price: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Commission Rate (%)</Label>
                        <Input
                          type="number"
                          value={formData.commission_rate}
                          onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Sort Order</Label>
                        <Input
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block">Features</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Add a feature..."
                          className="bg-white/5 border-white/10 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        />
                        <Button onClick={addFeature} variant="outline" className="border-white/10 text-white">
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.features.map((feature, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                            <span className="text-gray-300">{feature}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeFeature(i)} className="text-rose-400 hover:text-rose-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.recurring_commission}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recurring_commission: checked }))}
                        />
                        <Label className="text-gray-300">Recurring Commission</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.is_popular}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
                        />
                        <Label className="text-gray-300">Mark as Popular</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                        />
                        <Label className="text-gray-300">Active</Label>
                      </div>
                    </div>

                    <Button
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      {editingPackage ? 'Update Package' : 'Create Package'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Packages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [1,2,3].map(i => (
                  <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                ))
              ) : packages.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No packages yet. Create your first one!</p>
                </div>
              ) : (
                packages.map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <GlassCard className={`p-6 relative ${!pkg.is_active ? 'opacity-50' : ''}`}>
                      {pkg.is_popular && (
                        <div className="absolute -top-3 -right-3">
                          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                          <p className="text-gray-400 text-sm">{pkg.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(pkg)} className="text-gray-400 hover:text-white">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteMutation.mutate(pkg.id)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly:</span>
                          <span className="text-white font-bold">${pkg.monthly_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Yearly:</span>
                          <span className="text-white font-bold">${pkg.yearly_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Commission:</span>
                          <span className="text-emerald-400 font-bold">{pkg.commission_rate}%</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {pkg.recurring_commission && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                            Recurring
                          </Badge>
                        )}
                        <Badge className={`border ${pkg.is_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                          {pkg.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-gray-400 text-sm">{pkg.features?.length || 0} features</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
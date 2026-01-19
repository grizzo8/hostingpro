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
    price: 0,
    daily_payout: 0,
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
      price: 0,
      daily_payout: 0,
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
      price: pkg.price || 0,
      daily_payout: pkg.daily_payout || 0,
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
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

         <main className="flex-1 p-6 overflow-auto bg-white">
           <div className="max-w-7xl mx-auto space-y-6">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex items-center justify-between"
             >
               <div>
                 <h1 className="text-3xl font-bold text-slate-900 mb-2">Packages</h1>
                 <p className="text-gray-600">Manage hosting packages and commission rates.</p>
               </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                   <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700">
                     <Plus className="w-4 h-4 mr-2" />
                     Add Package
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="bg-white border-red-200 max-w-2xl max-h-[90vh] overflow-y-auto">
                   <DialogHeader>
                     <DialogTitle className="text-slate-900">
                      {editingPackage ? 'Edit Package' : 'Create Package'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-900">Package Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 bg-white border-2 border-red-200 text-slate-900"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-900">Slug</Label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          className="mt-1 bg-white border-2 border-red-200 text-slate-900"
                          placeholder="e.g. starter, business"
                        />
                      </div>
                    </div>

                    <div>
                       <Label className="text-slate-900">Description</Label>
                       <Textarea
                         value={formData.description}
                         onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                         className="mt-1 bg-white border-2 border-red-200 text-slate-900"
                       />
                     </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Label className="text-slate-900">Upfront Price ($)</Label>
                         <Input
                           type="number"
                           value={formData.price}
                           onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                           className="mt-1 bg-white border-2 border-red-200 text-slate-900"
                         />
                       </div>
                       <div>
                         <Label className="text-slate-900">Daily Payout ($)</Label>
                         <Input
                           type="number"
                           value={formData.daily_payout}
                           onChange={(e) => setFormData(prev => ({ ...prev, daily_payout: parseFloat(e.target.value) || 0 }))}
                           className="mt-1 bg-white border-2 border-red-200 text-slate-900"
                         />
                       </div>
                     </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Label className="text-slate-900">Commission Rate (%)</Label>
                         <Input
                           type="number"
                           value={formData.commission_rate}
                           onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
                           className="mt-1 bg-white border-2 border-red-200 text-slate-900"
                         />
                       </div>
                       <div>
                         <Label className="text-slate-900">Sort Order</Label>
                         <Input
                           type="number"
                           value={formData.sort_order}
                           onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                           className="mt-1 bg-white border-2 border-red-200 text-slate-900"
                         />
                       </div>
                     </div>

                    <div>
                       <Label className="text-slate-900 mb-2 block">Features</Label>
                       <div className="flex gap-2 mb-2">
                         <Input
                           value={newFeature}
                           onChange={(e) => setNewFeature(e.target.value)}
                           placeholder="Add a feature..."
                           className="bg-white border-2 border-red-200 text-slate-900"
                           onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                         />
                         <Button onClick={addFeature} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                           Add
                         </Button>
                       </div>
                       <div className="space-y-2">
                         {formData.features.map((feature, i) => (
                           <div key={i} className="flex items-center justify-between bg-red-50 p-2 rounded-lg">
                             <span className="text-slate-900">{feature}</span>
                             <Button variant="ghost" size="sm" onClick={() => removeFeature(i)} className="text-red-600 hover:text-red-700">
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
                         <Label className="text-slate-900">Recurring Commission</Label>
                       </div>
                       <div className="flex items-center gap-3">
                         <Switch
                           checked={formData.is_popular}
                           onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
                         />
                         <Label className="text-slate-900">Mark as Popular</Label>
                       </div>
                       <div className="flex items-center gap-3">
                         <Switch
                           checked={formData.is_active}
                           onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                         />
                         <Label className="text-slate-900">Active</Label>
                       </div>
                     </div>

                     <Button
                       onClick={() => saveMutation.mutate()}
                       disabled={saveMutation.isPending}
                       className="w-full bg-gradient-to-r from-red-600 to-blue-600"
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
                           <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                           <p className="text-gray-600 text-sm">{pkg.description}</p>
                         </div>
                         <div className="flex gap-1">
                           <Button variant="ghost" size="icon" onClick={() => openEditDialog(pkg)} className="text-gray-600 hover:text-red-600">
                             <Pencil className="w-4 h-4" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => deleteMutation.mutate(pkg.id)}
                             className="text-red-600 hover:text-red-700"
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                       </div>

                       <div className="space-y-3">
                         <div className="flex justify-between">
                           <span className="text-gray-600">Upfront:</span>
                           <span className="text-slate-900 font-bold">${pkg.price}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600">Daily Payout:</span>
                           <span className="text-slate-900 font-bold">${pkg.daily_payout}/day</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-gray-600">Commission:</span>
                           <span className="text-red-600 font-bold">{pkg.commission_rate}%</span>
                         </div>
                       </div>

                       <div className="flex flex-wrap gap-2 mt-4">
                         {pkg.recurring_commission && (
                           <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">
                             Recurring
                           </Badge>
                         )}
                         <Badge className={`border ${pkg.is_active ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-200 text-gray-700 border-gray-300'}`}>
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
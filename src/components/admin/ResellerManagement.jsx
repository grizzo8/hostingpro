import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';

export default function ResellerManagement({ affiliates }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', full_name: '' });
  const queryClient = useQueryClient();

  const resellers = affiliates.filter(a => a.is_reseller);

  const createResellerMutation = useMutation({
    mutationFn: async (data) => {
      const referralCode = `RES${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await base44.entities.Affiliate.create({
        user_email: data.email,
        full_name: data.full_name,
        referral_code: referralCode,
        status: 'approved',
        is_reseller: true,
        tier: 'platinum'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-affiliates'] });
      setShowForm(false);
      setFormData({ email: '', full_name: '' });
    }
  });

  const deleteResellerMutation = useMutation({
    mutationFn: (id) => base44.entities.Affiliate.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-affiliates'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.full_name) {
      createResellerMutation.mutate(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Sub-Affiliate Resellers</h2>
          <p className="text-gray-400 text-sm">Users who get every 2nd sale from their referrals</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reseller
        </Button>
      </div>

      {showForm && (
        <GlassCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Full Name</Label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={createResellerMutation.isPending}>
                {createResellerMutation.isPending ? 'Creating...' : 'Create Reseller'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      <GlassCard className="p-6">
        {resellers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No resellers yet</p>
            <p className="text-gray-500 text-sm">Add resellers to manage your sub-affiliate network</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resellers.map((reseller) => (
              <div key={reseller.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-medium">
                      {(reseller.full_name || reseller.user_email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{reseller.full_name}</p>
                      <p className="text-gray-400 text-sm">{reseller.user_email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">${(reseller.total_earnings || 0).toFixed(2)}</p>
                    <p className="text-gray-500 text-xs">{reseller.total_referrals} referrals</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Reseller
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteResellerMutation.mutate(reseller.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-6 bg-blue-500/10 border-blue-500/30">
        <h3 className="text-lg font-semibold text-white mb-3">How it Works</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>✓ Resellers have instant access to all packages</li>
          <li>✓ You get every 2nd sale from their referrals automatically</li>
          <li>✓ They get sales 1, 3, 5, 7... at 100% commission</li>
          <li>✓ You receive sales 2, 4, 6, 8... as admin commission</li>
        </ul>
      </GlassCard>
    </motion.div>
  );
}
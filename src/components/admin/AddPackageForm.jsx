import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from '@/components/ui/GlassCard';

export default function AddPackageForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    daily_payout: '',
    features: [],
    commission_rate: '',
    recurring_commission: false,
    is_popular: false,
    is_active: true,
    sort_order: 0
  });

  const queryClient = useQueryClient();

  const createPackageMutation = useMutation({
    mutationFn: (packageData) => base44.entities.HostingPackage.create(packageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-packages', 'packages'] });
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        daily_payout: '',
        features: [],
        commission_rate: '',
        recurring_commission: false,
        is_popular: false,
        is_active: true,
        sort_order: 0
      });
      setIsOpen(false);
    },
  });

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const packageData = {
      ...formData,
      price: parseFloat(formData.price),
      daily_payout: parseFloat(formData.daily_payout),
      commission_rate: parseFloat(formData.commission_rate),
      sort_order: parseInt(formData.sort_order)
    };
    createPackageMutation.mutate(packageData);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Package
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <GlassCard className="p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add New Package</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Package Name</label>
              <Input
                placeholder="e.g., Bronze Package"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="border-red-200 focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Slug (URL-friendly)</label>
              <Input
                placeholder="e.g., bronze-package"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
                className="border-red-200 focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
            <Textarea
              placeholder="Describe this package"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border-red-200 focus:border-red-600"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Upfront Price ($)</label>
              <Input
                type="number"
                placeholder="e.g., 99.99"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                step="0.01"
                className="border-red-200 focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Daily Payout ($)</label>
              <Input
                type="number"
                placeholder="e.g., 49.99"
                value={formData.daily_payout}
                onChange={(e) => setFormData({...formData, daily_payout: e.target.value})}
                required
                step="0.01"
                className="border-red-200 focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Commission Rate (%)</label>
              <Input
                type="number"
                placeholder="e.g., 30"
                value={formData.commission_rate}
                onChange={(e) => setFormData({...formData, commission_rate: e.target.value})}
                required
                step="0.01"
                className="border-red-200 focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Features</label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a feature..."
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                className="border-red-200 focus:border-red-600"
              />
              <Button type="button" onClick={handleAddFeature} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="hover:text-red-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.recurring_commission}
                onChange={(e) => setFormData({...formData, recurring_commission: e.target.checked})}
                className="w-4 h-4 text-red-600 border-red-300 rounded"
              />
              <span className="text-sm font-semibold text-slate-900">Recurring Commission</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                className="w-4 h-4 text-red-600 border-red-300 rounded"
              />
              <span className="text-sm font-semibold text-slate-900">Mark as Popular</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="w-4 h-4 text-red-600 border-red-300 rounded"
              />
              <span className="text-sm font-semibold text-slate-900">Active</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPackageMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white"
            >
              {createPackageMutation.isPending ? 'Creating...' : 'Create Package'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
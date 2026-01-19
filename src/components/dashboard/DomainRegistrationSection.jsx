import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Globe, Plus, Loader2, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from '@/components/ui/GlassCard';

export default function DomainRegistrationSection({ affiliate, user }) {
  const [domain, setDomain] = useState('');
  const [years, setYears] = useState(1);
  const queryClient = useQueryClient();

  const { data: userDomains = [] } = useQuery({
    queryKey: ['user-domains', affiliate?.id],
    queryFn: () => base44.entities.Domain.filter({ affiliate_id: affiliate?.id }),
    enabled: !!affiliate?.id
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('registerDomain', {
        domain: domain.toLowerCase().trim(),
        years: parseInt(years),
        domainContact: {
          first_name: user.full_name?.split(' ')[0] || 'User',
          last_name: user.full_name?.split(' ')[1] || 'Account',
          email: user.email,
          phone: '+1.2025550123',
          address1: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postal_code: '12345',
          country: 'US'
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setDomain('');
      setYears(1);
      queryClient.invalidateQueries(['user-domains', affiliate?.id]);
      queryClient.invalidateQueries(['affiliate', user?.email]);
    }
  });

  const handleRegister = () => {
    if (!domain.trim() || !domain.includes('.')) {
      alert('Please enter a valid domain name (e.g., example.com)');
      return;
    }
    registerMutation.mutate();
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">Domain Registration</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-emerald-400 font-medium">Earn Commission on Each Domain</p>
          <p className="text-gray-400 text-sm mt-1">
            Register domains for your users and earn 50% commission ($5 per domain). Your users get affordable domains, you get paid instantly.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Domain Name</Label>
              <Input
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={registerMutation.isPending}
                className="mt-2 bg-slate-900 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-300">Registration Period</Label>
              <select
                value={years}
                onChange={(e) => setYears(e.target.value)}
                disabled={registerMutation.isPending}
                className="mt-2 w-full bg-slate-900 border border-white/10 text-white rounded-md px-3 py-2"
              >
                {[1, 2, 3, 5, 10].map(y => (
                  <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={registerMutation.isPending || !domain.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Register Domain
              </>
            )}
          </Button>

          {registerMutation.isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{registerMutation.error?.message}</p>
            </div>
          )}
        </div>

        {userDomains.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-3">Your Domains</h4>
            <div className="space-y-2">
              {userDomains.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-mono">{d.domain_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">{d.years}y</span>
                    <div className={`w-2 h-2 rounded-full ${d.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
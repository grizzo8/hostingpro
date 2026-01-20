import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

export default function AuthCallback() {
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          window.location.href = createPageUrl('Home');
          return;
        }

        const user = await base44.auth.me();
        
        // Check if this is a new user (first login)
        const affiliates = await base44.entities.Affiliate.filter({ user_email: user.email });
        
        // Get referral code from URL or session storage
        const urlParams = new URLSearchParams(window.location.search);
        let referralCode = urlParams.get('ref') || sessionStorage.getItem('referralCode');
        
        if (affiliates.length === 0) {
          // New user - generate password and send credentials email
          const password = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 5).toUpperCase();
          
          setStatus('Sending your login details...');
          
          await base44.functions.invoke('sendLoginCredentials', {
            email: user.email,
            full_name: user.full_name,
            password: password,
            referralCode: referralCode
          });
        }
        
        // Redirect to Packages page with referral code
        sessionStorage.removeItem('referralCode'); // Clean up
        window.location.href = createPageUrl(`Packages${referralCode ? `?ref=${referralCode}` : ''}`);
        
      } catch (error) {
        setStatus('Error: ' + error.message);
        setTimeout(() => {
          window.location.href = createPageUrl('Home');
        }, 2000);
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-900 text-lg">{status}</p>
      </div>
    </div>
  );
}
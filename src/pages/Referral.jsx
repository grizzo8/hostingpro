import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Referral() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract referral code from URL path
    const pathParts = window.location.pathname.split('/');
    const referralCode = pathParts[pathParts.length - 1];

    if (referralCode) {
      // Redirect to packages page with referral code as parameter
      navigate(createPageUrl(`Packages?ref=${referralCode}`), { replace: true });
    } else {
      navigate(createPageUrl('Home'), { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
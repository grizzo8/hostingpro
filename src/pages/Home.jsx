import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PackagesPreview from '@/components/landing/PackagesPreview';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    checkAuth();
  }, []);

  const { data: packages = [] } = useQuery({
    queryKey: ['packages-preview'],
    queryFn: () => base44.entities.HostingPackage.filter({ is_active: true }, 'sort_order', 3)
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      <HeroSection />
      <FeaturesSection />
      <PackagesPreview packages={packages} />
      <CTASection />
      <Footer />
    </div>
  );
}
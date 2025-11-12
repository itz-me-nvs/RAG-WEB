'use client';

import LandingHeader from '@/components/LandingHeader';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FooterComponent from '@/components/FooterComponent';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <FooterComponent />
    </div>
  );
}

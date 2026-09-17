'use client';

import { HeroSection } from '@/components/public/sections/hero-section';
import { WhySection, HowSection, ServicesSection } from '@/components/public/sections/marketing-sections';
import { ClientExperienceSection, DriverExperienceSection } from '@/components/public/sections/apps-sections';
import {
  SafetySection,
  PaymentSection,
  RealtimeSection,
  IntelligenceSection,
  ComingSoonSection,
  GlobalVisionSection,
  TechnologySection,
} from '@/components/public/sections/trust-future-sections';
import {
  StatsSection,
  DownloadSection,
  TestimonialsSection,
  FaqSection,
  ContactSection,
} from '@/components/public/sections/closing-sections';

export function VayrixLanding() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <HowSection />
      <ServicesSection />
      <ClientExperienceSection />
      <DriverExperienceSection />
      <SafetySection />
      <PaymentSection />
      <RealtimeSection />
      <IntelligenceSection />
      <ComingSoonSection />
      <GlobalVisionSection />
      <TechnologySection />
      <StatsSection />
      <DownloadSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}

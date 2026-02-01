'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { HeroSection } from './hero-section';
import SectionDivider from './section-divider';
import MouseBackground from './mouse-background';
import LandingHeader from './header';

const FeaturesSection = dynamic(() => import('./features'), {
  loading: () => <div className="loading-skeleton features-skeleton">Loading features...</div>,
  ssr: true,
});

const PricingSection = dynamic(() => import('./pricing').then((mod) => ({ default: mod.PricingSection })), {
  loading: () => <div className="loading-skeleton pricing-skeleton">Loading pricing...</div>,
  ssr: false,
});

const TestimonialsSection = dynamic(() => import('./testimonials'), {
  loading: () => <div className="loading-skeleton testimonials-skeleton">Loading testimonials...</div>,
  ssr: true,
});

const ContactSection = dynamic(() => import('./contact'), {
  loading: () => <div className="loading-skeleton contact-skeleton">Loading contact...</div>,
  ssr: false,
});

const OurClients = dynamic(() => import('./our-client'), {
  loading: () => <div className="loading-skeleton clients-skeleton">Loading clients...</div>,
  ssr: true,
});

const FAQSection = dynamic(() => import('./faq'), {
  loading: () => <div className="loading-skeleton faq-skeleton">Loading FAQ...</div>,
  ssr: false,
});

const AppFooter = dynamic(() => import('./footer'), {
  loading: () => <div className="loading-skeleton footer-skeleton">Loading footer...</div>,
  ssr: true,
});

export default function LandingPageClient() {
  return (
    <section className="landing-section">
      <MouseBackground />
      <LandingHeader />
      <main>
        <HeroSection />
        <SectionDivider />
        <Suspense fallback={<div className="loading-skeleton">Loading content...</div>}>
          <FeaturesSection />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="loading-skeleton">Loading pricing...</div>}>
          <PricingSection />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="loading-skeleton">Loading testimonials...</div>}>
          <TestimonialsSection />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="loading-skeleton">Loading contact...</div>}>
          <ContactSection />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="loading-skeleton">Loading clients...</div>}>
          <OurClients />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<div className="loading-skeleton">Loading FAQ...</div>}>
          <FAQSection />
        </Suspense>
        <SectionDivider />
      </main>
      <Suspense fallback={<div className="loading-skeleton">Loading footer...</div>}>
        <AppFooter />
      </Suspense>
    </section>
  );
}


import { Suspense } from 'react';
import { ContactSection } from '@/components/landing/ContactSection';
import { EmployerCtaSection } from '@/components/landing/EmployerCtaSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { JobOpeningsSection } from '@/components/landing/JobOpeningsSection';
import { JobOpeningsSectionSkeleton } from '@/components/landing/JobOpeningsSectionSkeleton';
import { QualitiesSection } from '@/components/landing/QualitiesSection';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <QualitiesSection />
        <Suspense fallback={<JobOpeningsSectionSkeleton />}>
          <JobOpeningsSection />
        </Suspense>
        <EmployerCtaSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}

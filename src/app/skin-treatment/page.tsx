import type { Metadata } from 'next';
import { LandingTopBar } from './_components/landing-top-bar';
import { LandingHero } from './_components/landing-hero';
import { LandingUspBar } from './_components/landing-usp-bar';
import { TreatmentsSection } from './_components/treatments-section';
import { OffersStrip } from './_components/offers-strip';
import { WhySkinSection } from './_components/why-skin-section';
import { ResultsStrip } from './_components/results-strip';
import { GalleryStrip } from './_components/gallery-strip';
import { DoctorSpotlight } from './_components/doctor-spotlight';
import { LandingFaq } from './_components/landing-faq';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ReachUsSection } from './_components/reach-us-section';
import { FinalCta } from '@/components/sections/final-cta';
import { Footer } from '@/components/layout/footer';
import { WhatsappFloatButton } from '@/components/layout/whatsapp-float-button';
import { LandingMobileBar } from './_components/landing-mobile-bar';
import { MotionProvider } from '@/components/ui/motion-provider';

export const metadata: Metadata = {
  title: 'Skin Treatment Clinic — Acne, Pigmentation & Anti-Ageing Care',
  description:
    'Book a free consultation for acne, pigmentation, acne scars, and anti-ageing skin treatments with certified dermatologists at White Plum Wellness.',
};

export const revalidate = 60;

/** Standalone Google Ads landing page — deliberately outside the (site) route
 * group, so it skips the full site nav/mobile-sticky-bar and gets its own
 * conversion-focused top bar + sticky CTA bar instead. */
export default function SkinTreatmentLandingPage() {
  return (
    <MotionProvider>
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <LandingTopBar />
        <LandingHero />
        <LandingUspBar />
        <TreatmentsSection />
        <OffersStrip />
        <WhySkinSection />
        <ResultsStrip />
        <DoctorSpotlight />
        <GalleryStrip />
        <LandingFaq />
        <TestimonialsSection />
        <ReachUsSection />
        <FinalCta />
        <Footer />
        <WhatsappFloatButton />
        <LandingMobileBar />
      </div>
    </MotionProvider>
  );
}

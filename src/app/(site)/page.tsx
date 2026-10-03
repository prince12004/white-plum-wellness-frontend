import { Hero } from '@/components/sections/hero';
import { TrustStats } from '@/components/sections/trust-stats';
import { TreatmentCategories } from '@/components/sections/treatment-categories';
import { PopularTreatments } from '@/components/sections/popular-treatments';
import { ConcernsSection } from '@/components/sections/concerns-section';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { PhilosophySection } from '@/components/sections/philosophy-section';
import { TreatmentJourney } from '@/components/sections/treatment-journey';
import { BeforeAfterSection } from '@/components/sections/before-after-section';
import { FeaturedPackages } from '@/components/sections/featured-packages';
import { DoctorsSection } from '@/components/sections/doctors-section';
import { ClinicLocator } from '@/components/sections/clinic-locator';
import { OffersSection } from '@/components/sections/offers-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { AwardsSection } from '@/components/sections/awards-section';
import { BlogsSection } from '@/components/sections/blogs-section';
import { FaqSection } from '@/components/sections/faq-section';
import { FinalCta } from '@/components/sections/final-cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <TreatmentCategories />
      <PopularTreatments />
      <ConcernsSection />
      <WhyChooseUs />
      <PhilosophySection />
      <TreatmentJourney />
      <BeforeAfterSection />
      <FeaturedPackages />
      <DoctorsSection />
      <ClinicLocator />
      <OffersSection />
      <TestimonialsSection />
      <AwardsSection />
      <BlogsSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}

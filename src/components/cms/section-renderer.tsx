import type { CmsSection } from '@white/types';
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
import { LandingHero } from '@/app/skin-treatment/_components/landing-hero';
import { LandingUspBar } from '@/app/skin-treatment/_components/landing-usp-bar';
import { TreatmentsSection } from '@/app/skin-treatment/_components/treatments-section';
import { OffersStrip } from '@/app/skin-treatment/_components/offers-strip';
import { WhySkinSection } from '@/app/skin-treatment/_components/why-skin-section';
import { ResultsStrip } from '@/app/skin-treatment/_components/results-strip';
import { DoctorSpotlight } from '@/app/skin-treatment/_components/doctor-spotlight';
import { GalleryStrip } from '@/app/skin-treatment/_components/gallery-strip';
import { LandingFaq } from '@/app/skin-treatment/_components/landing-faq';
import { ReachUsSection } from '@/app/skin-treatment/_components/reach-us-section';
import { isSectionType, type SectionProps, type SectionType } from '@/lib/cms/sections';
import { BannerBlock, CardsBlock, CtaBlock, DividerBlock, RichTextBlock, TextImageBlock } from './blocks';

const RENDERERS: Record<SectionType, (props: SectionProps) => JSX.Element | null | Promise<JSX.Element | null>> = {
  hero: Hero,
  'trust-stats': TrustStats,
  'treatment-categories': TreatmentCategories,
  'popular-treatments': PopularTreatments,
  concerns: ConcernsSection,
  'why-choose-us': WhyChooseUs,
  philosophy: PhilosophySection,
  'treatment-journey': TreatmentJourney,
  'before-after': BeforeAfterSection,
  'featured-packages': FeaturedPackages,
  doctors: DoctorsSection,
  'clinic-locator': ClinicLocator,
  offers: OffersSection,
  testimonials: TestimonialsSection,
  awards: AwardsSection,
  blogs: BlogsSection,
  faq: FaqSection,
  'final-cta': FinalCta,
  'landing-hero': LandingHero,
  'landing-usp': LandingUspBar,
  'landing-treatments': TreatmentsSection,
  'landing-offers': OffersStrip,
  'landing-why': WhySkinSection,
  'landing-results': ResultsStrip,
  'landing-doctor': DoctorSpotlight,
  'landing-gallery': GalleryStrip,
  'landing-faq': LandingFaq,
  'landing-reach': ReachUsSection,
  'rich-text': RichTextBlock,
  banner: BannerBlock,
  'text-image': TextImageBlock,
  cards: CardsBlock,
  cta: CtaBlock,
  divider: DividerBlock,
};

/** Renders a page's active sections in saved order. */
export function CmsSections({ sections }: { sections: CmsSection[] }) {
  return (
    <>
      {sections.map((section) => {
        if (!section.isActive || !isSectionType(section.type)) return null;
        const Component = RENDERERS[section.type];
        return <Component key={section.id} content={section.content} />;
      })}
    </>
  );
}

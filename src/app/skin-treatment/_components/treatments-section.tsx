import { Container, Section, SectionHeading } from '@/components/ui/container';
import { TreatmentOfferCard } from './treatment-offer-card';
import { TreatmentsCarousel } from './treatments-carousel';
import { getServicesByCategory } from '@/data/services';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function TreatmentsSection({ content }: SectionProps) {
  const c = sectionContent('landing-treatments', content);
  const services = await getServicesByCategory(c.categorySlug);
  const featured = services.slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          description={c.description}
        />
        {/* Mobile/tablet: static grid. Desktop: a slider, since 6+ cards at 4-per-row
            leaves an awkward half-empty last row — scrolling through reads better. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
          {featured.map((service, i) => (
            <TreatmentOfferCard key={service.slug} service={service} ctaLabel={c.cardCtaLabel} delay={(i % 4) * 80} />
          ))}
        </div>
        <div className="hidden lg:block">
          <TreatmentsCarousel services={featured} ctaLabel={c.cardCtaLabel} />
        </div>
      </Container>
    </Section>
  );
}

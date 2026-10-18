import { Container, Section, SectionHeading } from '@/components/ui/container';
import { TreatmentOfferCard } from './treatment-offer-card';
import { TreatmentsCarousel } from './treatments-carousel';
import { getServicesByCategory } from '@/data/services';

export async function TreatmentsSection() {
  const services = await getServicesByCategory('skin');
  const featured = services.slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Skin Treatments We Offer"
          description="Each protocol is personalised to your skin after a one-on-one consultation with our dermatologists."
        />
        {/* Mobile/tablet: static grid. Desktop: a slider, since 6+ cards at 4-per-row
            leaves an awkward half-empty last row — scrolling through reads better. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
          {featured.map((service, i) => (
            <TreatmentOfferCard key={service.slug} service={service} delay={(i % 4) * 80} />
          ))}
        </div>
        <div className="hidden lg:block">
          <TreatmentsCarousel services={featured} />
        </div>
      </Container>
    </Section>
  );
}

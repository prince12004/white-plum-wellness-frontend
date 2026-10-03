import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ServiceCard } from '@/components/cards/service-card';
import { Button } from '@white/ui';
import { getPopularServices } from '@/data/services';

export async function PopularTreatments() {
  const allPopular = await getPopularServices();
  const popular = allPopular.slice(0, 8);

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow="Most Requested"
          title="Popular Treatments"
          description="The treatments our patients ask for most — each backed by a clear, personalised protocol."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((service, i) => (
            <ScrollReveal key={service.slug} delay={(i % 4) * 80}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services">
            <Button variant="secondary" size="lg">View All Services</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

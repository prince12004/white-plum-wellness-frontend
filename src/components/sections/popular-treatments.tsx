import Link from 'next/link';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ServiceCard } from '@/components/cards/service-card';
import { Button } from '@white/ui';
import { getAllServices, getPopularServices } from '@/data/services';
import { safeHref } from '@/lib/cms/href';
import { pickFeatured, sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function PopularTreatments({ content }: SectionProps) {
  const c = sectionContent('popular-treatments', content);
  const services = c.featuredSlugs.length > 0 ? await getAllServices() : await getPopularServices();
  const popular = pickFeatured(services, c.featuredSlugs, 8);

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          description={c.description}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((service, i) => (
            <ScrollReveal key={service.slug} delay={(i % 4) * 80}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>
        {c.ctaLabel && (
          <div className="mt-10 text-center">
            <Link href={safeHref(c.ctaHref)}>
              <Button variant="secondary" size="lg">{c.ctaLabel}</Button>
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}

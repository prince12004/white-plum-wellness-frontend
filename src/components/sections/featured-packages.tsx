import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { safeHref } from '@/lib/cms/href';
import { pickFeatured, sectionContent, type SectionProps } from '@/lib/cms/sections';
import { Container, Section } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { PackageCard } from '@/components/cards/package-card';
import { getAllPackages } from '@/data/packages';

export async function FeaturedPackages({ content }: SectionProps) {
  const c = sectionContent('featured-packages', content);
  const packages = await getAllPackages();
  const featured = pickFeatured(packages, c.featuredSlugs, 3);

  return (
    <Section>
      <Container>
        <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-600">{c.eyebrow}</p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-semibold text-charcoal-900 md:text-4xl">
              {c.title}
            </h2>
            {c.description && <p className="mt-3 max-w-md text-charcoal-500">{c.description}</p>}
          </div>
          {c.ctaLabel && (
            <Link
              href={safeHref(c.ctaHref)}
              className="group flex shrink-0 items-center gap-1.5 font-display text-sm font-medium text-charcoal-900 hover:text-peach-600"
            >
              {c.ctaLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((pkg, i) => (
            <ScrollReveal key={pkg.slug} delay={i * 100}>
              <PackageCard pkg={pkg} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

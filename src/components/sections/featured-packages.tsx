import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { PackageCard } from '@/components/cards/package-card';
import { getAllPackages } from '@/data/packages';

export async function FeaturedPackages() {
  const packages = await getAllPackages();
  const featured = packages.slice(0, 3);

  return (
    <Section>
      <Container>
        <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-600">Curated Programs</p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-semibold text-charcoal-900 md:text-4xl">
              Featured Packages
            </h2>
            <p className="mt-3 max-w-md text-charcoal-500">
              Structured, multi-session programs designed around specific goals — priced transparently upfront.
            </p>
          </div>
          <Link
            href="/packages"
            className="group flex shrink-0 items-center gap-1.5 font-display text-sm font-medium text-charcoal-900 hover:text-peach-600"
          >
            View all packages
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
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

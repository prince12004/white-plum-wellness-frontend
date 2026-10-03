import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { OfferCard } from '@/components/cards/offer-card';
import { getAllOffers } from '@/data/offers';

export async function OffersSection() {
  const offers = await getAllOffers();
  const featured = offers.slice(0, 3);

  return (
    <Section tone="muted">
      <Container>
        <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-600">Limited Time</p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-semibold text-charcoal-900 md:text-4xl">
              Offers worth booking for
            </h2>
          </div>
          <Link
            href="/offers"
            className="group flex shrink-0 items-center gap-1.5 font-display text-sm font-medium text-charcoal-900 hover:text-peach-600"
          >
            View all offers
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((offer, i) => (
            <ScrollReveal key={offer.slug} delay={i * 100}>
              <OfferCard offer={offer} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

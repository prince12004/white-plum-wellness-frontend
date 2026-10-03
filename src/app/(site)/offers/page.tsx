import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/container';
import { OfferCard } from '@/components/cards/offer-card';
import { getAllOffers } from '@/data/offers';

export const metadata: Metadata = {
  title: 'Offers',
  description: 'Seasonal offers, free trials, and limited-time pricing across our treatments.',
};

export default async function OffersPage() {
  const offers = await getAllOffers();
  return (
    <>
      <Breadcrumb items={[{ label: 'Offers' }]} />
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">Current Offers</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            From free consultations to seasonal package pricing — here&apos;s what&apos;s currently available.
          </p>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

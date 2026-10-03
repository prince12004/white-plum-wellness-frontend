import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { PopReveal } from '@/components/ui/motion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getClinicBySlug } from '@/data/clinics';
import { getAllOffers, getOfferBySlug } from '@/data/offers';
import { getServiceBySlug } from '@/data/services';

export async function generateStaticParams() {
  const offers = await getAllOffers();
  return offers.map((o) => ({ slug: o.slug }));
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return {};
  return { title: offer.title, description: offer.description };
}

export default async function OfferDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const [treatment, offerClinicsRaw] = await Promise.all([
    offer.treatmentSlug ? getServiceBySlug(offer.treatmentSlug) : Promise.resolve(undefined),
    Promise.all(offer.clinicSlugs.map((s) => getClinicBySlug(s))),
  ]);
  const offerClinics = offerClinicsRaw.filter(Boolean);

  return (
    <>
      <Breadcrumb items={[{ label: 'Offers', href: '/offers' }, { label: offer.title }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-20 text-white">
        <Image src={offer.image} alt={offer.title} fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">{offer.offerType}</p>
          <PopReveal>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold sm:text-5xl">{offer.title}</h1>
          </PopReveal>
          <p className="mt-4 max-w-xl text-ivory-100/80">{offer.description}</p>
          {offer.offerPrice !== null && offer.originalPrice !== null && (
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold text-peach-300">
                {offer.offerPrice === 0 ? 'Free' : `₹${offer.offerPrice.toLocaleString('en-IN')}`}
              </span>
              <span className="text-ivory-100/50 line-through">₹{offer.originalPrice.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <BookAppointmentButton size="lg" context={{ offer: offer.title }}>
              Book Now
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ offer: offer.title }} className="h-12 px-6 text-base">
              WhatsApp About This Offer
            </WhatsappCtaLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col gap-10 lg:col-span-2">
              <div>
                <SectionHeading eyebrow="Details" title="Terms & Conditions" align="left" className="mb-6" />
                <ul className="flex flex-col gap-3">
                  {offer.terms.map((term) => (
                    <li key={term} className="flex items-start gap-3 text-base leading-relaxed text-charcoal-600">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-peach-500" />
                      {term}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-charcoal-400">
                  Valid until {new Date(offer.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {treatment && (
                <div>
                  <SectionHeading eyebrow="Applicable Treatment" title={treatment.name} align="left" className="mb-4" />
                  <p className="text-base leading-relaxed text-charcoal-600">{treatment.shortDescription}</p>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-charcoal-900">Available At</h3>
                <ul className="flex flex-col gap-2 text-base leading-relaxed text-charcoal-600">
                  {offerClinics.map((c) => c && <li key={c.slug}>{c.name}</li>)}
                </ul>
                <BookAppointmentButton context={{ offer: offer.title }} className="w-full">
                  Book Now
                </BookAppointmentButton>
                <WhatsappCtaLink context={{ offer: offer.title }} className="w-full">
                  WhatsApp About This Offer
                </WhatsappCtaLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ServiceCard } from '@/components/cards/service-card';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { forMenSections } from '@/data/content';
import { getServicesByCategory } from '@/data/services';
import { placeholderImage } from '@/data/images';

export const metadata: Metadata = {
  title: 'For Men',
  description: 'Dedicated hair, skin, beard, and body treatments for men.',
};

export default async function ForMenPage() {
  const [hair, skin, laser, body] = await Promise.all([
    getServicesByCategory('hair'),
    getServicesByCategory('skin'),
    getServicesByCategory('laser'),
    getServicesByCategory('body'),
  ]);
  const menServices = [...hair.slice(0, 2), ...skin.slice(0, 2), ...laser.slice(0, 1), ...body.slice(0, 1)];

  return (
    <>
      <Breadcrumb items={[{ label: 'For Men' }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-24 text-white">
        <Image src={placeholderImage('for-men-hero', 1600, 900)} alt="For Men" fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">For Men</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            Practical Skin, Hair &amp; Body Care — Built for Men
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ivory-100/80">
            No fuss, no jargon — just effective treatment for the concerns men actually come in for.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookAppointmentButton size="lg">Book Consultation</BookAppointmentButton>
            <WhatsappCtaLink className="h-12 px-6 text-base">WhatsApp Now</WhatsappCtaLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="What We Cover" title="Focus Areas" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {forMenSections.map((section) => (
              <Link
                key={section.slug}
                href={`/services/${section.slug === 'beard' || section.slug === 'acne' ? 'skin' : section.slug === 'anti-ageing' ? 'anti-ageing' : section.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <Image src={section.image} alt={section.title} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-charcoal-900">{section.title}</h3>
                  <p className="mt-1 text-xs text-charcoal-500">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading eyebrow="Popular With Our Patients" title="Recommended Treatments" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menServices.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </Section>

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Ready to get started?</h2>
          <div className="mt-6 flex justify-center gap-3">
            <BookAppointmentButton size="lg">Book Consultation</BookAppointmentButton>
          </div>
        </Container>
      </section>
    </>
  );
}

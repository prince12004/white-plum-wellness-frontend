import type { Metadata } from 'next';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ServiceCard } from '@/components/cards/service-card';
import { PackageCard } from '@/components/cards/package-card';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { FaqAccordion } from '@/components/ui/accordion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getServicesByCategory } from '@/data/services';
import { getPackagesByCategory } from '@/data/packages';
import { bridalTimeline } from '@/data/content';
import { getAllTestimonials } from '@/data/testimonials';
import { getAllBeforeAfterResults } from '@/data/before-after';
import { getHomepageFaqs } from '@/data/faqs';
import { placeholderImage } from '@/data/images';

export const metadata: Metadata = {
  title: 'Bridal',
  description: 'A curated pre-bridal journey combining skin, hair, and body treatments, timed around your wedding.',
};

export default async function BridalPage() {
  const [bridalServices, bridalPackages, testimonials, beforeAfterResults, homepageFaqs] = await Promise.all([
    getServicesByCategory('bridal'),
    getPackagesByCategory('bridal'),
    getAllTestimonials(),
    getAllBeforeAfterResults(),
    getHomepageFaqs(),
  ]);
  const bridalTestimonial = testimonials.find((t) => t.treatment.toLowerCase().includes('bridal'));
  const bridalResult = beforeAfterResults.find((r) => r.category === 'Skin');

  return (
    <>
      <Breadcrumb items={[{ label: 'Bridal' }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-24 text-white">
        <Image src={placeholderImage('bridal-hero', 1600, 900)} alt="Bridal" fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">Bridal Journey</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">A Glow Worth Planning For</h1>
          <p className="mx-auto mt-4 max-w-xl text-ivory-100/80">
            A timed treatment journey across skin, hair, and body — planned backward from your wedding date.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookAppointmentButton size="lg" context={{ package: 'Bridal Glow Package' }}>
              Book Bridal Consultation
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ package: 'Bridal Glow Package' }} className="h-12 px-6 text-base">
              WhatsApp Now
            </WhatsappCtaLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Plan Ahead" title="Your Bridal Timeline" description="A realistic timeline that avoids last-minute skin surprises." />
          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-5">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-ivory-200 sm:block" aria-hidden="true" />
            {bridalTimeline.map((item, i) => (
              <div key={item.title} className="relative flex flex-col items-center text-center">
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-peach-500 text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold-600">{item.month}</p>
                <h3 className="mt-1 font-display text-sm font-semibold text-charcoal-900">{item.title}</h3>
                <p className="mt-1 text-xs text-charcoal-500">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading eyebrow="Skin, Hair & Body" title="Bridal Treatments" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bridalServices.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </Section>

      {bridalPackages.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Curated for You" title="Bridal Packages" align="left" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {bridalPackages.map((p) => (
                <PackageCard key={p.slug} pkg={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {bridalResult && (
        <Section tone="muted">
          <Container className="max-w-xl">
            <SectionHeading eyebrow="Real Results" title="Before & After" />
            <BeforeAfterSlider beforeImage={bridalResult.beforeImage} afterImage={bridalResult.afterImage} />
          </Container>
        </Section>
      )}

      {bridalTestimonial && (
        <Section>
          <Container className="max-w-xl">
            <SectionHeading eyebrow="A Real Bride's Story" title="Testimonial" />
            <TestimonialCard testimonial={bridalTestimonial} />
          </Container>
        </Section>
      )}

      <Section tone="muted">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <FaqAccordion items={homepageFaqs.slice(0, 5)} />
        </Container>
      </Section>

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Start planning your bridal glow today</h2>
          <div className="mt-6 flex justify-center gap-3">
            <BookAppointmentButton size="lg" context={{ package: 'Bridal Glow Package' }}>
              Book Bridal Consultation
            </BookAppointmentButton>
          </div>
        </Container>
      </section>
    </>
  );
}

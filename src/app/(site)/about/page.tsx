import type { Metadata } from 'next';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { DoctorCard } from '@/components/cards/doctor-card';
import { ClinicCard } from '@/components/cards/clinic-card';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { whyChooseUs, awards } from '@/data/content';
import { getAllDoctors } from '@/data/doctors';
import { getAllClinics } from '@/data/clinics';
import { getFeaturedTestimonials } from '@/data/testimonials';
import { placeholderImage } from '@/data/images';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${siteConfig.businessName}'s philosophy, team, and approach to dermatology and aesthetic care.`,
};

export default async function AboutPage() {
  const [doctors, clinics, featuredTestimonials] = await Promise.all([
    getAllDoctors(),
    getAllClinics(),
    getFeaturedTestimonials(),
  ]);
  return (
    <>
      <Breadcrumb items={[{ label: 'About' }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-24 text-white">
        <Image src={placeholderImage('about-hero', 1600, 900)} alt="Our clinic" fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">About {siteConfig.businessName}</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            Care Built on Honesty, Not Hype
          </h1>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image src={placeholderImage('about-story', 900, 700)} alt="Our story" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div>
              <SectionHeading eyebrow="Our Story" title="Why We Started" align="left" className="mb-4" />
              <p className="text-charcoal-700">
                {siteConfig.businessName} was founded on a simple frustration: too many patients were being sold
                treatments before anyone properly diagnosed what they actually needed. We set out to build a clinic
                where the consultation comes first, always.
              </p>
              <p className="mt-4 text-charcoal-700">
                Today, we operate {clinics.length} clinics with a team of {doctors.length}+ specialists, but the
                founding principle hasn&apos;t changed — real assessment, honest timelines, and treatment plans built
                around you, not a fixed package.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <h3 className="font-display text-lg font-semibold text-charcoal-900">Our Philosophy</h3>
              <p className="mt-2 text-sm text-charcoal-500">Diagnose first, treat second — never the other way around.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <h3 className="font-display text-lg font-semibold text-charcoal-900">Our Mission</h3>
              <p className="mt-2 text-sm text-charcoal-500">Make expert dermatology care accessible, honest, and personalised.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <h3 className="font-display text-lg font-semibold text-charcoal-900">Our Vision</h3>
              <p className="mt-2 text-sm text-charcoal-500">To be the clinic patients trust enough to refer their own family to.</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Why Patients Choose Us" title="Why Choose Us" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl border border-ivory-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-600">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-charcoal-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading eyebrow="Meet the Team" title="Our Doctors" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.slice(0, 4).map((doctor) => (
              <DoctorCard key={doctor.slug} doctor={doctor} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Visit Us" title="Our Clinics" align="left" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {clinics.slice(0, 4).map((clinic) => (
              <ClinicCard key={clinic.slug} clinic={clinic} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading eyebrow="Recognition" title="Awards" align="left" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((award) => (
              <div key={award.title} className="flex flex-col items-center gap-2 rounded-2xl border border-ivory-200 bg-white p-6 text-center">
                <Award className="h-6 w-6 text-gold-500" />
                <p className="text-sm font-semibold text-charcoal-900">{award.title}</p>
                <p className="text-xs text-charcoal-500">{award.issuer} · {award.year}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Patient Stories" title="Testimonials" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTestimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </Container>
      </Section>

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Come see the difference in person</h2>
          <div className="mt-6 flex justify-center gap-3">
            <BookAppointmentButton size="lg">Book Consultation</BookAppointmentButton>
          </div>
        </Container>
      </section>
    </>
  );
}

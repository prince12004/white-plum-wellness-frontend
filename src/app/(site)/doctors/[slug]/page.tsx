import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Award, Languages } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { PopReveal } from '@/components/ui/motion';
import { ServiceCard } from '@/components/cards/service-card';
import { ClinicCard } from '@/components/cards/clinic-card';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getAllDoctors, getDoctorBySlug } from '@/data/doctors';
import { getClinicBySlug } from '@/data/clinics';
import { getAllServices } from '@/data/services';
import { getAllTestimonials } from '@/data/testimonials';
import { getAllBeforeAfterResults } from '@/data/before-after';

export async function generateStaticParams() {
  const doctors = await getAllDoctors();
  return doctors.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  return { title: doctor.name, description: `${doctor.qualification} — ${doctor.specialization.join(', ')}` };
}

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const [allServices, resolvedClinics, allBeforeAfterResults, allTestimonials] = await Promise.all([
    getAllServices(),
    Promise.all(doctor.clinicSlugs.map((s) => getClinicBySlug(s))),
    getAllBeforeAfterResults(),
    getAllTestimonials(),
  ]);

  const doctorServices = allServices.filter((s) => s.doctorSlugs.includes(doctor.slug));
  const doctorClinics = resolvedClinics.filter(Boolean);
  const doctorResults = allBeforeAfterResults.filter((r) => r.doctorSlug === doctor.slug).slice(0, 2);
  const doctorTestimonials = allTestimonials.filter((t) => doctorServices.some((s) => s.name === t.treatment)).slice(0, 2);

  return (
    <>
      <Breadcrumb items={[{ label: 'Doctors', href: '/doctors' }, { label: doctor.name }]} />

      <section className="bg-gradient-to-b from-peach-50 to-white py-16">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl lg:mx-0">
              <Image src={doctor.photo} alt={doctor.name} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover" />
            </div>
            <div className="lg:col-span-2">
              <PopReveal>
                <h1 className="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">{doctor.name}</h1>
              </PopReveal>
              <p className="mt-2 text-charcoal-500">{doctor.qualification}</p>
              <p className="mt-1 text-sm font-medium text-gold-600">{doctor.experienceYears}+ years of experience</p>
              <p className="mt-4 max-w-xl text-charcoal-700">{doctor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {doctor.specialization.map((s) => (
                  <span key={s} className="rounded-full bg-peach-100 px-3 py-1 text-xs font-medium text-peach-700">
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-charcoal-500">
                <Languages className="h-4 w-4 text-peach-500" /> {doctor.languages.join(', ')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <BookAppointmentButton size="lg" context={{ doctor: doctor.name }}>
                  Book Consultation
                </BookAppointmentButton>
                <WhatsappCtaLink context={{ doctor: doctor.name }} className="h-12 px-6 text-base">
                  WhatsApp Now
                </WhatsappCtaLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {doctor.awards.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Recognition" title="Awards & Certifications" align="left" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {doctor.awards.map((award) => (
                <div key={award} className="flex items-start gap-3 rounded-xl border border-ivory-200 bg-white p-4">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <p className="text-base leading-relaxed text-charcoal-700">{award}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {doctorServices.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading eyebrow="Areas of Focus" title="Treatments" align="left" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctorServices.slice(0, 6).map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {doctorClinics.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Where to Meet" title="Clinics" align="left" />
            <div className="flex flex-col gap-4">
              {doctorClinics.map((c) => c && <ClinicCard key={c.slug} clinic={c} />)}
            </div>
          </Container>
        </Section>
      )}

      {doctorResults.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading eyebrow="Real Results" title="Before & After" align="left" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {doctorResults.map((r) => (
                <BeforeAfterSlider key={r.id} beforeImage={r.beforeImage} afterImage={r.afterImage} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {doctorTestimonials.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Patient Stories" title="Testimonials" align="left" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {doctorTestimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Book a consultation with {doctor.name}</h2>
          <div className="mt-6 flex justify-center gap-3">
            <BookAppointmentButton size="lg" context={{ doctor: doctor.name }}>
              Book Consultation
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ doctor: doctor.name }} className="h-12 px-6 text-base">
              WhatsApp Now
            </WhatsappCtaLink>
          </div>
        </Container>
      </section>
    </>
  );
}

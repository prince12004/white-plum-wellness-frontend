import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { PopReveal } from '@/components/ui/motion';
import { DoctorCard } from '@/components/cards/doctor-card';
import { ServiceCard } from '@/components/cards/service-card';
import { PackageCard } from '@/components/cards/package-card';
import { FaqAccordion } from '@/components/ui/accordion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getAllClinics, getClinicBySlug } from '@/data/clinics';
import { getDoctorsByClinic } from '@/data/doctors';
import { getAllServices } from '@/data/services';
import { getAllPackages } from '@/data/packages';
import { getAllGalleryItems } from '@/data/content';
import { getHomepageFaqs } from '@/data/faqs';
import { placeholderImage } from '@/data/images';

export async function generateStaticParams() {
  const clinics = await getAllClinics();
  return clinics.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);
  if (!clinic) return {};
  return { title: clinic.name, description: `${clinic.name} — ${clinic.address}` };
}

export default async function ClinicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);
  if (!clinic) notFound();

  const [clinicDoctors, allServices, allPackages, galleryItems, homepageFaqs] = await Promise.all([
    getDoctorsByClinic(clinic.slug),
    getAllServices(),
    getAllPackages(),
    getAllGalleryItems(),
    getHomepageFaqs(),
  ]);
  const clinicServices = allServices.filter((s) => s.clinicSlugs.includes(clinic.slug)).slice(0, 6);
  const clinicPackages = allPackages.filter((p) => p.clinicSlugs.includes(clinic.slug)).slice(0, 3);

  return (
    <>
      <Breadcrumb items={[{ label: 'Clinics', href: '/clinics' }, { label: clinic.name }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-20 text-white">
        <Image src={clinic.image} alt={clinic.name} fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">{clinic.city}</p>
          <PopReveal>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold sm:text-5xl">{clinic.name}</h1>
          </PopReveal>
          <p className="mt-4 max-w-xl text-ivory-100/80">{clinic.address}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BookAppointmentButton size="lg" context={{ clinic: clinic.name }}>
              Book Appointment
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ clinic: clinic.name, city: clinic.city }} className="h-12 px-6 text-base">
              WhatsApp Now
            </WhatsappCtaLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-6 lg:col-span-1">
              <h2 className="font-display text-lg font-semibold text-charcoal-900">Clinic Info</h2>
              <p className="flex items-start gap-3 text-base leading-relaxed text-charcoal-600">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-peach-500" /> {clinic.address}
              </p>
              <p className="flex items-center gap-3 text-base leading-relaxed text-charcoal-600">
                <Phone className="h-5 w-5 shrink-0 text-peach-500" /> {clinic.phone}
              </p>
              <p className="flex items-center gap-3 text-base leading-relaxed text-charcoal-600">
                <Mail className="h-5 w-5 shrink-0 text-peach-500" /> {clinic.email}
              </p>
              <div className="flex items-start gap-3 text-base leading-relaxed text-charcoal-600">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-peach-500" />
                <div>
                  {clinic.openingHours.map((h) => (
                    <p key={h.day}>
                      {h.day}: {h.hours}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-ivory-200 lg:col-span-2">
              <Image src={placeholderImage(`map-${clinic.slug}`, 900, 500)} alt={`Map for ${clinic.name}`} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </Section>

      {clinicDoctors.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading eyebrow="Meet the Team" title="Doctors at This Clinic" align="left" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {clinicDoctors.map((d) => (
                <DoctorCard key={d.slug} doctor={d} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {clinicServices.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Available Here" title="Services" align="left" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clinicServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {clinicPackages.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading eyebrow="Save More" title="Packages" align="left" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {clinicPackages.map((p) => (
                <PackageCard key={p.slug} pkg={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <SectionHeading eyebrow="A Look Inside" title="Gallery" align="left" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {galleryItems
              .filter((g) => g.category === 'Clinic')
              .slice(0, 4)
              .map((item) => (
                <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.caption} fill sizes="25vw" className="object-cover" />
                </div>
              ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <FaqAccordion items={homepageFaqs.slice(0, 5)} />
        </Container>
      </Section>

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Visit us at {clinic.name}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <BookAppointmentButton size="lg" context={{ clinic: clinic.name }}>
              Book Appointment
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ clinic: clinic.name, city: clinic.city }} className="h-12 px-6 text-base">
              WhatsApp Now
            </WhatsappCtaLink>
            <Link
              href={`https://www.google.com/maps/search/${encodeURIComponent(clinic.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-base font-medium text-white hover:bg-white/10"
            >
              Get Directions
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

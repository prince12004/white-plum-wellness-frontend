import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { PopReveal } from '@/components/ui/motion';
import { DoctorCard } from '@/components/cards/doctor-card';
import { ClinicCard } from '@/components/cards/clinic-card';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { FaqAccordion } from '@/components/ui/accordion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getAllPackages, getPackageBySlug } from '@/data/packages';
import { getDoctorBySlug } from '@/data/doctors';
import { getClinicBySlug } from '@/data/clinics';
import { getAllTestimonials } from '@/data/testimonials';
import { getAllBeforeAfterResults } from '@/data/before-after';

export async function generateStaticParams() {
  const packages = await getAllPackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};
  return { title: pkg.name, description: pkg.description };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const [doctor, packageClinicsRaw, allBeforeAfterResults, allTestimonials] = await Promise.all([
    getDoctorBySlug(pkg.doctorSlug),
    Promise.all(pkg.clinicSlugs.map((s) => getClinicBySlug(s))),
    getAllBeforeAfterResults(),
    getAllTestimonials(),
  ]);
  const packageClinics = packageClinicsRaw.filter(Boolean);
  const relatedResult = allBeforeAfterResults.find((r) => r.category.toLowerCase() === pkg.categorySlug.split('-')[0]);
  const packageTestimonials = allTestimonials.filter((t) => pkg.treatmentsIncluded.some((tr) => tr.includes(t.treatment))).slice(0, 2);
  const discount = Math.round(((pkg.originalPrice - pkg.offerPrice) / pkg.originalPrice) * 100);

  return (
    <>
      <Breadcrumb items={[{ label: 'Packages', href: '/packages' }, { label: pkg.name }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-20 text-white">
        <Image src={pkg.image} alt={pkg.name} fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">Package · {discount}% Off</p>
          <PopReveal>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold sm:text-5xl">{pkg.name}</h1>
          </PopReveal>
          <p className="mt-4 max-w-xl text-ivory-100/80">{pkg.description}</p>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-peach-300">₹{pkg.offerPrice.toLocaleString('en-IN')}</span>
            <span className="text-ivory-100/50 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <BookAppointmentButton size="lg" context={{ package: pkg.name }}>
              Book Consultation
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ package: pkg.name }} className="h-12 px-6 text-base">
              Enquire on WhatsApp
            </WhatsappCtaLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col gap-12 lg:col-span-2">
              <div>
                <SectionHeading eyebrow="What's Included" title="Treatments Included" align="left" className="mb-6" />
                <ul className="flex flex-col gap-3">
                  {pkg.treatmentsIncluded.map((t) => (
                    <li key={t} className="flex items-start gap-3 rounded-xl bg-peach-50 p-4 text-base leading-relaxed text-charcoal-700">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-peach-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <SectionHeading eyebrow="Why This Package" title="Benefits" align="left" className="mb-6" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {pkg.benefits.map((b) => (
                    <div key={b} className="rounded-xl border border-ivory-200 bg-white p-4 text-base leading-relaxed text-charcoal-700">
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {relatedResult && (
                <div>
                  <SectionHeading eyebrow="Real Results" title="Before & After" align="left" className="mb-6" />
                  <div className="max-w-xl">
                    <BeforeAfterSlider beforeImage={relatedResult.beforeImage} afterImage={relatedResult.afterImage} />
                  </div>
                </div>
              )}

              {doctor && (
                <div>
                  <SectionHeading eyebrow="Led By" title="Doctor" align="left" className="mb-6" />
                  <div className="max-w-xs">
                    <DoctorCard doctor={doctor} />
                  </div>
                </div>
              )}

              {packageClinics.length > 0 && (
                <div>
                  <SectionHeading eyebrow="Where to Go" title="Available Clinics" align="left" className="mb-6" />
                  <div className="flex flex-col gap-4">
                    {packageClinics.map((c) => c && <ClinicCard key={c.slug} clinic={c} />)}
                  </div>
                </div>
              )}

              {packageTestimonials.length > 0 && (
                <div>
                  <SectionHeading eyebrow="Patient Stories" title="Testimonials" align="left" className="mb-6" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {packageTestimonials.map((t) => (
                      <TestimonialCard key={t.id} testimonial={t} />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <SectionHeading eyebrow="Common Questions" title="FAQs" align="left" className="mb-6" />
                <FaqAccordion items={pkg.faqs} />
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-peach-600">₹{pkg.offerPrice.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-charcoal-300 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between border-b border-ivory-100 pb-2">
                    <dt className="text-charcoal-500">Sessions</dt>
                    <dd className="font-medium text-charcoal-900">{pkg.sessions}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal-500">Duration</dt>
                    <dd className="font-medium text-charcoal-900">{pkg.duration}</dd>
                  </div>
                </dl>
                <BookAppointmentButton context={{ package: pkg.name }} className="w-full">
                  Book Consultation
                </BookAppointmentButton>
                <WhatsappCtaLink context={{ package: pkg.name }} className="w-full">
                  Enquire on WhatsApp
                </WhatsappCtaLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

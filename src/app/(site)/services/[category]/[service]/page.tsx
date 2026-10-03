import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Check, Clock, Layers, ShieldCheck, Sparkles, Timer } from 'lucide-react';
import { Badge } from '@white/ui';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { PopReveal } from '@/components/ui/motion';
import { ServiceCard } from '@/components/cards/service-card';
import { PackageCard } from '@/components/cards/package-card';
import { DoctorCard } from '@/components/cards/doctor-card';
import { ClinicCard } from '@/components/cards/clinic-card';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { BlogCard } from '@/components/cards/blog-card';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { FaqAccordion } from '@/components/ui/accordion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getCategoryBySlug } from '@/data/categories';
import { getAllServices, getRelatedServices, getServiceBySlug } from '@/data/services';
import { getDoctorBySlug } from '@/data/doctors';
import { getClinicBySlug } from '@/data/clinics';
import { getPackagesByCategory } from '@/data/packages';
import { getAllTestimonials } from '@/data/testimonials';
import { getAllBeforeAfterResults } from '@/data/before-after';
import { getAllBlogs } from '@/data/blogs';

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((s) => ({ category: s.categorySlug, service: s.slug }));
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; service: string }>;
}): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const service = await getServiceBySlug(serviceSlug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.shortDescription,
    openGraph: { title: service.name, description: service.shortDescription, images: [service.image] },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; service: string }>;
}) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const service = await getServiceBySlug(serviceSlug);
  if (!service || service.categorySlug !== categorySlug) notFound();

  const [
    category,
    relatedServices,
    categoryPackages,
    allBeforeAfterResults,
    allTestimonials,
    allBlogs,
    primaryDoctor,
    availableClinics,
  ] = await Promise.all([
    getCategoryBySlug(service.categorySlug),
    getRelatedServices(service),
    getPackagesByCategory(service.categorySlug),
    getAllBeforeAfterResults(),
    getAllTestimonials(),
    getAllBlogs(),
    service.doctorSlugs[0] ? getDoctorBySlug(service.doctorSlugs[0]) : Promise.resolve(undefined),
    Promise.all(service.clinicSlugs.map((slug) => getClinicBySlug(slug))),
  ]);

  const relatedPackages = categoryPackages.slice(0, 2);
  const relatedResult = allBeforeAfterResults.find((r) => r.treatmentSlug === service.slug);
  const relatedTestimonials = allTestimonials.filter((t) => t.treatment === service.name).slice(0, 2);
  const relatedBlogs = allBlogs.filter((b) => b.relatedServiceSlugs.includes(service.slug)).slice(0, 3);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services' },
          { label: category?.name ?? service.categorySlug, href: `/services/${service.categorySlug}` },
          { label: service.name },
        ]}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-charcoal-900 py-20 text-white">
        <Image src={service.image} alt={service.name} fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative">
          {category && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">{category.name}</p>}
          <PopReveal>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold sm:text-5xl">{service.name}</h1>
          </PopReveal>
          <p className="mt-4 max-w-xl text-ivory-100/80">{service.shortDescription}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BookAppointmentButton size="lg" context={{ service: service.name }}>
              Book Consultation
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ service: service.name }} className="h-12 px-6 text-base">
              WhatsApp Now
            </WhatsappCtaLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* MAIN CONTENT */}
            <div className="flex flex-col gap-16 lg:col-span-2">
              {/* WHAT IS IT */}
              <div>
                <SectionHeading eyebrow="Overview" title="What is this treatment?" align="left" className="mb-6" />
                <p className="text-charcoal-700">{service.detail.whatIsIt}</p>
              </div>

              {/* WHO IS IT FOR / PROBLEMS ADDRESSED */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-ivory-200 bg-white p-6">
                  <h3 className="font-display text-lg font-semibold text-charcoal-900">Who is it for?</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {service.detail.whoIsItFor.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-base leading-relaxed text-charcoal-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-white p-6">
                  <h3 className="font-display text-lg font-semibold text-charcoal-900">Problems It Addresses</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {service.detail.problemsAddressed.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-base leading-relaxed text-charcoal-600">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* BENEFITS */}
              <div>
                <SectionHeading eyebrow="Why It Works" title="Benefits" align="left" className="mb-6" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {service.detail.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3 rounded-xl bg-peach-50 p-4">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-peach-600" />
                      <p className="text-base leading-relaxed text-charcoal-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOW IT WORKS + TECH */}
              <div>
                <SectionHeading eyebrow="The Science" title="How It Works" align="left" className="mb-6" />
                <p className="text-charcoal-700">{service.detail.howItWorks}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatBadge icon={Layers} label="Technology" value={service.detail.technology.split(' ').slice(0, 3).join(' ')} />
                  <StatBadge icon={Clock} label="Duration" value={service.detail.duration} />
                  <StatBadge icon={Timer} label="Sessions" value={service.detail.sessions} />
                  <StatBadge icon={ShieldCheck} label="Recovery" value={service.detail.recovery.split('.')[0] ?? ''} />
                </div>
              </div>

              {/* PROCESS TIMELINE */}
              <div>
                <SectionHeading eyebrow="Step by Step" title="Treatment Process" align="left" className="mb-8" />
                <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-5">
                  <div className="absolute left-0 right-0 top-5 hidden h-px bg-ivory-200 sm:block" aria-hidden="true" />
                  {service.detail.process.map((step, i) => (
                    <div key={step.title} className="relative flex flex-col items-center text-center">
                      <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-peach-500 text-sm font-semibold text-white">
                        {i + 1}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-charcoal-900">{step.title}</p>
                      <p className="mt-1 text-xs text-charcoal-500">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESULTS + RECOVERY */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-gold-50 p-6">
                  <h3 className="font-display text-lg font-semibold text-charcoal-900">Expected Results</h3>
                  <p className="mt-2 text-base leading-relaxed text-charcoal-600">{service.detail.results}</p>
                </div>
                <div className="rounded-2xl bg-ivory-100 p-6">
                  <h3 className="font-display text-lg font-semibold text-charcoal-900">Recovery</h3>
                  <p className="mt-2 text-base leading-relaxed text-charcoal-600">{service.detail.recovery}</p>
                </div>
              </div>

              {/* PRE/POST CARE */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-display text-lg font-semibold text-charcoal-900">Pre-Treatment Instructions</h3>
                  <ul className="mt-4 flex flex-col gap-2">
                    {service.detail.preCare.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-base leading-relaxed text-charcoal-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-charcoal-900">Post-Treatment Care</h3>
                  <ul className="mt-4 flex flex-col gap-2">
                    {service.detail.postCare.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-base leading-relaxed text-charcoal-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* BEFORE AFTER */}
              {relatedResult && (
                <div>
                  <SectionHeading eyebrow="Real Results" title="Before & After" align="left" className="mb-6" />
                  <div className="max-w-xl">
                    <BeforeAfterSlider beforeImage={relatedResult.beforeImage} afterImage={relatedResult.afterImage} />
                  </div>
                </div>
              )}

              {/* DOCTOR RECOMMENDATION */}
              {primaryDoctor && (
                <div>
                  <SectionHeading eyebrow="Recommended By" title="Doctor" align="left" className="mb-6" />
                  <div className="max-w-xs">
                    <DoctorCard doctor={primaryDoctor} />
                  </div>
                </div>
              )}

              {/* AVAILABLE CLINICS */}
              {availableClinics.length > 0 && (
                <div>
                  <SectionHeading eyebrow="Where to Go" title="Available Clinics" align="left" className="mb-6" />
                  <div className="flex flex-col gap-4">
                    {availableClinics.map((clinic) => clinic && <ClinicCard key={clinic.slug} clinic={clinic} />)}
                  </div>
                </div>
              )}

              {/* RELATED PACKAGES */}
              {relatedPackages.length > 0 && (
                <div>
                  <SectionHeading eyebrow="Save More" title="Related Packages" align="left" className="mb-6" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {relatedPackages.map((pkg) => (
                      <PackageCard key={pkg.slug} pkg={pkg} />
                    ))}
                  </div>
                </div>
              )}

              {/* RELATED SERVICES */}
              {relatedServices.length > 0 && (
                <div>
                  <SectionHeading eyebrow="You May Also Like" title="Related Services" align="left" className="mb-6" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedServices.map((s) => (
                      <ServiceCard key={s.slug} service={s} />
                    ))}
                  </div>
                </div>
              )}

              {/* TESTIMONIALS */}
              {relatedTestimonials.length > 0 && (
                <div>
                  <SectionHeading eyebrow="Patient Stories" title="Testimonials" align="left" className="mb-6" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {relatedTestimonials.map((t) => (
                      <TestimonialCard key={t.id} testimonial={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              <div>
                <SectionHeading eyebrow="Common Questions" title="FAQs" align="left" className="mb-6" />
                <FaqAccordion items={service.detail.faqs} />
              </div>

              {/* RELATED BLOGS */}
              {relatedBlogs.length > 0 && (
                <div>
                  <SectionHeading eyebrow="Learn More" title="Related Articles" align="left" className="mb-6" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedBlogs.map((blog) => (
                      <BlogCard key={blog.slug} blog={blog} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STICKY SIDEBAR CTA */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
                {service.startingPrice > 0 && (
                  <p className="text-sm text-charcoal-500">
                    Starting at <span className="text-xl font-semibold text-peach-600">₹{service.startingPrice.toLocaleString('en-IN')}</span>
                  </p>
                )}
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between border-b border-ivory-100 pb-2">
                    <dt className="text-charcoal-500">Duration</dt>
                    <dd className="font-medium text-charcoal-900">{service.detail.duration}</dd>
                  </div>
                  <div className="flex justify-between border-b border-ivory-100 pb-2">
                    <dt className="text-charcoal-500">Sessions</dt>
                    <dd className="font-medium text-charcoal-900">{service.detail.sessions}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal-500">Downtime</dt>
                    <dd className="text-right font-medium text-charcoal-900">{service.detail.recovery.split('.')[0]}</dd>
                  </div>
                </dl>
                <BookAppointmentButton context={{ service: service.name }} className="w-full">
                  Book Consultation
                </BookAppointmentButton>
                <WhatsappCtaLink context={{ service: service.name }} className="w-full">
                  WhatsApp Now
                </WhatsappCtaLink>
                {service.popular && (
                  <Badge variant="peach" className="w-fit">
                    Popular Treatment
                  </Badge>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Ready to start your {service.name.toLowerCase()} journey?</h2>
          <div className="mt-6 flex justify-center gap-3">
            <BookAppointmentButton size="lg" context={{ service: service.name }}>
              Book Consultation
            </BookAppointmentButton>
            <WhatsappCtaLink context={{ service: service.name }} className="h-12 px-6 text-base">
              WhatsApp Us
            </WhatsappCtaLink>
          </div>
        </Container>
      </section>
    </>
  );
}

function StatBadge({ icon: StatIcon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-ivory-100 p-3 text-center">
      <StatIcon className="h-5 w-5 text-peach-500" />
      <p className="text-[11px] uppercase tracking-wide text-charcoal-400">{label}</p>
      <p className="text-xs font-medium text-charcoal-800">{value}</p>
    </div>
  );
}

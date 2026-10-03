import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ServiceCard } from '@/components/cards/service-card';
import { PackageCard } from '@/components/cards/package-card';
import { DoctorCard } from '@/components/cards/doctor-card';
import { FaqAccordion } from '@/components/ui/accordion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getServicesByCategory } from '@/data/services';
import { getPackagesByCategory } from '@/data/packages';
import { getAllConcerns } from '@/data/concerns';
import { getAllDoctors } from '@/data/doctors';
import { getHomepageFaqs } from '@/data/faqs';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

// All valid category slugs are known at build time — treat anything else as a
// real 404 at the routing layer rather than rendering on-demand.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: `${category.name} Treatments`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const [categoryServices, categoryPackages, allConcerns, allDoctors, homepageFaqs] = await Promise.all([
    getServicesByCategory(category.slug),
    getPackagesByCategory(category.slug),
    getAllConcerns(),
    getAllDoctors(),
    getHomepageFaqs(),
  ]);
  const relatedConcerns = allConcerns.filter((c) => c.recommendedServiceSlugs.some((s) => categoryServices.some((cs) => cs.slug === s)));
  const relatedDoctors = allDoctors.filter((d) => categoryServices.some((s) => s.doctorSlugs.includes(d.slug))).slice(0, 4);

  return (
    <>
      <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: category.name }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-20 text-white">
        <Image src={category.image} alt={category.name} fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">Treatment Category</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold sm:text-5xl">{category.name}</h1>
          <p className="mt-4 max-w-xl text-ivory-100/80">{category.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BookAppointmentButton size="lg">Book Consultation</BookAppointmentButton>
            <WhatsappCtaLink className="h-12 px-6 text-base">WhatsApp Now</WhatsappCtaLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow={`${categoryServices.length} Treatments`} title={`${category.name} Services`} align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>

      {relatedConcerns.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading eyebrow="Related Concerns" title="Concerns We Address" align="left" />
            <div className="flex flex-wrap gap-3">
              {relatedConcerns.map((concern) => (
                <a
                  key={concern.slug}
                  href={`/concerns/${concern.slug}`}
                  className="rounded-full border border-ivory-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-700 hover:border-peach-300 hover:text-peach-600"
                >
                  {concern.name}
                </a>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {categoryPackages.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="Save More" title="Related Packages" align="left" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {categoryPackages.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {relatedDoctors.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading eyebrow="Our Specialists" title={`${category.name} Doctors`} align="left" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedDoctors.map((doctor) => (
                <DoctorCard key={doctor.slug} doctor={doctor} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <FaqAccordion items={homepageFaqs.slice(0, 5)} />
        </Container>
      </Section>

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Ready to get started with {category.name.toLowerCase()} care?</h2>
          <div className="mt-6 flex justify-center gap-3">
            <BookAppointmentButton size="lg">Book Consultation</BookAppointmentButton>
          </div>
        </Container>
      </section>
    </>
  );
}

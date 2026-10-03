import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { CategoryCard } from '@/components/cards/category-card';
import { ServiceCard } from '@/components/cards/service-card';
import { FaqAccordion } from '@/components/ui/accordion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { categories } from '@/data/categories';
import { getAllServices, getFeaturedServices, getPopularServices } from '@/data/services';
import { getHomepageFaqs } from '@/data/faqs';

export const metadata: Metadata = {
  title: 'All Services',
  description: 'Explore every skin, hair, laser, and aesthetic treatment offered across our clinics.',
};

export default async function ServicesPage() {
  const [services, featured, popular, homepageFaqs] = await Promise.all([
    getAllServices(),
    getFeaturedServices(),
    getPopularServices(),
    getHomepageFaqs(),
  ]);

  return (
    <>
      <Breadcrumb items={[{ label: 'Services' }]} />

      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">All Treatments</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            {services.length}+ treatments across {categories.length} specialities — browse by category or explore
            what&apos;s featured below.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Browse by Category" title="Choose a Speciality" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading eyebrow="Editor's Pick" title="Featured Services" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Most Requested" title="Popular Services" align="left" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading eyebrow="Everything We Offer" title="All Services" align="left" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.categorySlug}/${service.slug}`}
                className="flex items-center justify-between rounded-xl border border-ivory-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-700 hover:border-peach-300 hover:text-peach-600"
              >
                {service.name}
                <span className="text-xs text-charcoal-300">{service.categorySlug.replace(/-/g, ' ')}</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <FaqAccordion items={homepageFaqs.slice(0, 6)} />
        </Container>
      </Section>

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Not sure where to start?</h2>
          <p className="mt-3 text-ivory-100/70">Book a free consultation and we&apos;ll guide you to the right treatment.</p>
          <div className="mt-6 flex justify-center">
            <BookAppointmentButton size="lg">Book Free Consultation</BookAppointmentButton>
          </div>
        </Container>
      </section>
    </>
  );
}

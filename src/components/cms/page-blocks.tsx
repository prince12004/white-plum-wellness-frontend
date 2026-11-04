import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BlogsBrowser } from '@/components/blogs-browser';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { CategoryCard } from '@/components/cards/category-card';
import { ConcernCard } from '@/components/cards/concern-card';
import { DoctorCard } from '@/components/cards/doctor-card';
import { ClinicCard } from '@/components/cards/clinic-card';
import { OfferCard } from '@/components/cards/offer-card';
import { PackageCard } from '@/components/cards/package-card';
import { ServiceCard } from '@/components/cards/service-card';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { ClinicsFilter } from '@/components/clinics-filter';
import { BookingCta } from '@/components/cms/booking-cta';
import { fillCounts } from '@/components/cms/counts';
import { ContactForm } from '@/components/contact-form';
import { GalleryGrid } from '@/components/gallery-grid';
import { ResultsGallery } from '@/components/results-gallery';
import { FaqAccordion } from '@/components/ui/accordion';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { getAllBeforeAfterResults, getBeforeAfterCategories } from '@/data/before-after';
import { getAllBlogs, getBlogCategories } from '@/data/blogs';
import { getAllCategories } from '@/data/categories';
import { getAllClinics, getCities } from '@/data/clinics';
import { getAllConcerns } from '@/data/concerns';
import { getAllGalleryItems } from '@/data/content';
import { getAllDoctors } from '@/data/doctors';
import { getHomepageFaqs } from '@/data/faqs';
import { getAllOffers } from '@/data/offers';
import { getAllPackages, getPackagesByCategory } from '@/data/packages';
import { getAllServices, getFeaturedServices, getPopularServices, getServicesByCategory } from '@/data/services';
import { siteConfig } from '@/data/site';
import { getAllTestimonials, getFeaturedTestimonials } from '@/data/testimonials';
import { sectionContent, type SectionContent, type SectionProps } from '@/lib/cms/sections';

export async function PageHeaderBlock({ content }: SectionProps) {
  const c = sectionContent('page-header', content);
  const description = await fillCounts(c.description);
  const context = c.bookingPackage ? { package: c.bookingPackage } : undefined;

  if (!c.image) {
    return (
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          {c.eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-600">{c.eyebrow}</p>}
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">{c.title}</h1>
          {description && <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">{description}</p>}
          {(c.ctaLabel || c.whatsappLabel) && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {c.ctaLabel && (
                <BookingCta size="lg" href={c.ctaHref} context={context}>
                  {c.ctaLabel}
                </BookingCta>
              )}
              {c.whatsappLabel && (
                <WhatsappCtaLink context={context} className="h-12 px-6 text-base">
                  {c.whatsappLabel}
                </WhatsappCtaLink>
              )}
            </div>
          )}
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-24 text-white">
      <Image src={c.image} alt={c.imageAlt} fill sizes="100vw" className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
      <Container className="relative text-center">
        {c.eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">{c.eyebrow}</p>}
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">{c.title}</h1>
        {description && <p className="mx-auto mt-4 max-w-xl text-ivory-100/80">{description}</p>}
        {(c.ctaLabel || c.whatsappLabel) && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {c.ctaLabel && (
              <BookingCta size="lg" href={c.ctaHref} context={context}>
                {c.ctaLabel}
              </BookingCta>
            )}
            {c.whatsappLabel && (
              <WhatsappCtaLink context={context} className="h-12 px-6 text-base">
                {c.whatsappLabel}
              </WhatsappCtaLink>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

function limited<T>(items: T[], limit: number): T[] {
  return limit > 0 ? items.slice(0, limit) : items;
}

/** The items for a "Live data list" section, or null when there is nothing to show. */
async function DataItems({ c }: { c: SectionContent<'data-list'> }) {
  const grid = (className: string, children: React.ReactNode) => <div className={`grid grid-cols-1 gap-6 ${className}`}>{children}</div>;
  const services = (items: Awaited<ReturnType<typeof getAllServices>>, className = 'sm:grid-cols-2 lg:grid-cols-4') =>
    items.length === 0 ? null : grid(className, limited(items, c.limit).map((s) => <ServiceCard key={s.slug} service={s} />));

  switch (c.source) {
    case 'categories':
      return grid('sm:grid-cols-2 lg:grid-cols-4', limited(await getAllCategories(), c.limit).map((category) => <CategoryCard key={category.slug} category={category} />));
    case 'services':
      return services(c.categorySlug ? await getServicesByCategory(c.categorySlug) : await getAllServices());
    case 'featured services':
      return services(await getFeaturedServices());
    case 'popular services':
      return services(await getPopularServices());
    case 'service links': {
      const items = limited(await getAllServices(), c.limit);
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
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
      );
    }
    case 'packages': {
      const items = c.categorySlug ? await getPackagesByCategory(c.categorySlug) : await getAllPackages();
      return items.length === 0 ? null : grid('sm:grid-cols-2 lg:grid-cols-3', limited(items, c.limit).map((p) => <PackageCard key={p.slug} pkg={p} />));
    }
    case 'offers':
      return grid('sm:grid-cols-2 lg:grid-cols-3', limited(await getAllOffers(), c.limit).map((offer) => <OfferCard key={offer.slug} offer={offer} />));
    case 'doctors':
      return grid('sm:grid-cols-2 lg:grid-cols-4', limited(await getAllDoctors(), c.limit).map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />));
    case 'clinics':
      return grid('lg:grid-cols-2', limited(await getAllClinics(), c.limit).map((clinic) => <ClinicCard key={clinic.slug} clinic={clinic} />));
    case 'clinics with city filter': {
      const [clinics, cities] = await Promise.all([getAllClinics(), getCities()]);
      return <ClinicsFilter clinics={clinics} cities={cities} />;
    }
    case 'concerns':
      return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {limited(await getAllConcerns(), c.limit).map((concern) => (
            <ConcernCard key={concern.slug} concern={concern} />
          ))}
        </div>
      );
    case 'testimonials': {
      const keyword = c.keyword.toLowerCase();
      const items = keyword ? (await getAllTestimonials()).filter((t) => t.treatment.toLowerCase().includes(keyword)) : await getFeaturedTestimonials();
      return items.length === 0 ? null : grid('sm:grid-cols-2 lg:grid-cols-3', limited(items, c.limit).map((t) => <TestimonialCard key={t.id} testimonial={t} />));
    }
    case 'faqs':
      return <FaqAccordion items={limited(await getHomepageFaqs(), c.limit)} />;
    case 'blogs': {
      const [blogs, categories] = await Promise.all([getAllBlogs(), getBlogCategories()]);
      return <BlogsBrowser blogs={blogs} categories={categories} />;
    }
    case 'gallery':
      return <GalleryGrid items={await getAllGalleryItems()} />;
    case 'results': {
      const [results, categories, doctors, clinics] = await Promise.all([
        getAllBeforeAfterResults(),
        getBeforeAfterCategories(),
        getAllDoctors(),
        getAllClinics(),
      ]);
      return <ResultsGallery results={results} categories={categories} doctors={doctors} clinics={clinics} />;
    }
    default:
      return null;
  }
}

export async function DataListBlock({ content }: SectionProps) {
  const c = sectionContent('data-list', content);
  const items = await DataItems({ c });
  if (!items) return null;
  const description = await fillCounts(c.description);
  return (
    <Section tone={c.tone === 'muted' ? 'muted' : 'default'}>
      <Container className={c.source === 'faqs' ? 'max-w-3xl' : undefined}>
        {c.title && <SectionHeading eyebrow={c.eyebrow} title={c.title} description={description} align={c.align === 'left' ? 'left' : 'center'} />}
        {items}
      </Container>
    </Section>
  );
}

export function TimelineBlock({ content }: SectionProps) {
  const c = sectionContent('timeline', content);
  return (
    <Section tone={c.tone === 'muted' ? 'muted' : 'default'}>
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ivory-200 sm:block" aria-hidden="true" />
          {c.items.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-peach-500 text-sm font-semibold text-white">{i + 1}</div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold-600">{item.month}</p>
              <h3 className="mt-1 font-display text-sm font-semibold text-charcoal-900">{item.title}</h3>
              <p className="mt-1 text-xs text-charcoal-500">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export async function ContactPanelBlock({ content }: SectionProps) {
  const c = sectionContent('contact-panel', content);
  const [clinics, concerns] = await Promise.all([getAllClinics(), getAllConcerns()]);
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow={c.eyebrow} title={c.title} align="left" className="mb-6" />
            <ContactForm clinics={clinics} concerns={concerns} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-ivory-200 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-charcoal-900">{c.quickContactTitle}</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-charcoal-600">
                <a href={`tel:${siteConfig.contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-peach-600">
                  <Phone className="h-4 w-4 text-peach-500" /> {siteConfig.contactPhone}
                </a>
                <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center gap-2 hover:text-peach-600">
                  <Mail className="h-4 w-4 text-peach-500" /> {siteConfig.contactEmail}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" /> {siteConfig.address}
                </p>
              </div>
              {c.whatsappLabel && <WhatsappCtaLink className="mt-4 w-full">{c.whatsappLabel}</WhatsappCtaLink>}
            </div>

            <div className="rounded-2xl border border-ivory-200 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-charcoal-900">{c.clinicsTitle}</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-charcoal-600">
                {clinics.map((clinic) => (
                  <li key={clinic.slug}>
                    <p className="font-medium text-charcoal-900">{clinic.name}</p>
                    <p className="text-xs text-charcoal-400">
                      {clinic.openingHours[0]?.day}: {clinic.openingHours[0]?.hours}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

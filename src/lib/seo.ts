import type { Metadata } from 'next';
import type { Blog, Clinic, Service } from '@white/types';
import { siteConfig } from '@/data/site';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const HOME_TITLE = 'White Plum Wellness | Wellness, Skin & Beauty Clinic';
export const HOME_DESCRIPTION =
  'Discover White Plum Wellness, your destination for wellness, skin care and beauty services. Explore our treatments, clinics and expert care.';

/** Shared-link fallback when a page has no image of its own. */
const DEFAULT_IMAGE = '/logo.png';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

interface PageSeo {
  title: string;
  description?: string | null;
  /** Site path of the page's canonical URL, e.g. "/services/skin". */
  path: string;
  /** Overrides the canonical built from `path`, for admin-set canonical URLs. */
  canonical?: string | null;
  image?: string | null;
  keywords?: string | null;
  noIndex?: boolean;
  type?: 'website' | 'article';
  /** Use `title` as-is instead of appending the site name. */
  absoluteTitle?: boolean;
}

/** Title, description, canonical, Open Graph and Twitter tags for one page.
 * Next.js replaces (not merges) a parent's openGraph/twitter objects, so each page sets them in full. */
export function pageMetadata(seo: PageSeo): Metadata {
  const url = seo.canonical || absoluteUrl(seo.path);
  const fullTitle = seo.absoluteTitle ? seo.title : `${seo.title} | ${siteConfig.businessName}`;
  const images = [seo.image || DEFAULT_IMAGE];
  const description = seo.description || undefined;
  return {
    title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
    description,
    ...(seo.keywords && { keywords: seo.keywords }),
    alternates: { canonical: url },
    openGraph: { type: seo.type ?? 'website', url, title: fullTitle, description, siteName: siteConfig.businessName, locale: 'en_IN', images },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images },
    ...(seo.noIndex && { robots: { index: false, follow: false } }),
  };
}

const organizationRef = { '@id': ORGANIZATION_ID };

/** Only details the site already shows publicly — the contact email in data/site.ts is a placeholder, so it's left out. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: siteConfig.businessName,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/logo.png'),
        telephone: siteConfig.contactPhone,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: siteConfig.businessName,
        url: absoluteUrl('/'),
        publisher: organizationRef,
        inLanguage: 'en-IN',
      },
    ],
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  const trail = [{ label: 'Home', href: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      // Google accepts the last (current) crumb without a URL.
      ...(item.href && { item: absoluteUrl(item.href) }),
    })),
  };
}

export function articleSchema(blog: Blog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: [blog.image],
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: { '@type': 'Person', name: blog.author },
    publisher: { '@type': 'Organization', ...organizationRef, name: siteConfig.businessName, logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') } },
    mainEntityOfPage: absoluteUrl(`/blogs/${blog.slug}`),
  };
}

export function serviceSchema(service: Service, categoryName?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.shortDescription,
    image: service.image,
    url: absoluteUrl(`/services/${service.categorySlug}/${service.slug}`),
    ...(categoryName && { serviceType: categoryName }),
    provider: organizationRef,
    ...(service.startingPrice > 0 && {
      offers: { '@type': 'Offer', price: service.startingPrice, priceCurrency: 'INR' },
    }),
  };
}

export function clinicSchema(clinic: Clinic) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinic.name,
    image: clinic.image,
    url: absoluteUrl(`/clinics/${clinic.slug}`),
    telephone: clinic.phone,
    address: { '@type': 'PostalAddress', streetAddress: clinic.address, addressLocality: clinic.city, addressCountry: 'IN' },
    parentOrganization: organizationRef,
  };
}

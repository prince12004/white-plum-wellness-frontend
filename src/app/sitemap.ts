import type { MetadataRoute } from 'next';
import type { HomepageContent } from '@white/types';
import { getAllBlogs } from '@/data/blogs';
import { getAllCategories } from '@/data/categories';
import { getAllClinics } from '@/data/clinics';
import { getAllConcerns } from '@/data/concerns';
import { getAllDoctors } from '@/data/doctors';
import { getNavData } from '@/data/nav-pages';
import { getAllOffers } from '@/data/offers';
import { getAllPackages } from '@/data/packages';
import { getAllServices } from '@/data/services';
import { apiGet } from '@/lib/api';
import { SITE_URL, absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

/** One failing list shouldn't drop every other URL from the sitemap. */
async function entries<T extends { updatedAt?: string }>(load: () => Promise<T[]>, toPath: (item: T) => string): Promise<Entry[]> {
  try {
    return (await load()).map((item) => ({ url: absoluteUrl(toPath(item)), ...(item.updatedAt && { lastModified: item.updatedAt }) }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ pages }, home] = await Promise.all([getNavData(), apiGet<HomepageContent>('/homepage-cms').catch(() => null)]);
  const lists = await Promise.all([
    entries(getAllCategories, (c) => `/services/${c.slug}`),
    entries(getAllServices, (s) => `/services/${s.categorySlug}/${s.slug}`),
    entries(getAllConcerns, (c) => `/concerns/${c.slug}`),
    entries(getAllPackages, (p) => `/packages/${p.slug}`),
    entries(getAllOffers, (o) => `/offers/${o.slug}`),
    entries(getAllDoctors, (d) => `/doctors/${d.slug}`),
    entries(getAllClinics, (c) => `/clinics/${c.slug}`),
    entries(getAllBlogs, (b) => `/blogs/${b.slug}`),
  ]);

  return [
    // Matches the homepage canonical, which Next.js writes without the trailing slash.
    { url: SITE_URL, ...(home?.updatedAt && { lastModified: home.updatedAt }) },
    // Pages from Pages Management, minus any marked "Hide from search engines".
    ...pages.filter((page) => !page.noIndex).map((page) => ({ url: absoluteUrl(`/${page.slug}`), lastModified: page.updatedAt })),
    ...lists.flat(),
  ];
}

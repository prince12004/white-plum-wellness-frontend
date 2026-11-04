import type { MetadataRoute } from 'next';
import { getAllBlogs } from '@/data/blogs';
import { getAllCategories } from '@/data/categories';
import { getAllClinics } from '@/data/clinics';
import { getAllConcerns } from '@/data/concerns';
import { getAllDoctors } from '@/data/doctors';
import { getNavData } from '@/data/nav-pages';
import { getAllOffers } from '@/data/offers';
import { getAllPackages } from '@/data/packages';
import { getAllServices } from '@/data/services';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** One failing list shouldn't drop every other URL from the sitemap. */
async function paths<T>(load: () => Promise<T[]>, toPath: (item: T) => string): Promise<string[]> {
  try {
    return (await load()).map(toPath);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages } = await getNavData();
  const lists = await Promise.all([
    paths(getAllCategories, (c) => `/services/${c.slug}`),
    paths(getAllServices, (s) => `/services/${s.categorySlug}/${s.slug}`),
    paths(getAllConcerns, (c) => `/concerns/${c.slug}`),
    paths(getAllPackages, (p) => `/packages/${p.slug}`),
    paths(getAllOffers, (o) => `/offers/${o.slug}`),
    paths(getAllDoctors, (d) => `/doctors/${d.slug}`),
    paths(getAllClinics, (c) => `/clinics/${c.slug}`),
    paths(getAllBlogs, (b) => `/blogs/${b.slug}`),
  ]);

  return [
    { url: SITE_URL },
    ...pages.filter((page) => !page.noIndex).map((page) => ({ url: `${SITE_URL}/${page.slug}`, lastModified: page.updatedAt })),
    ...lists.flat().map((path) => ({ url: `${SITE_URL}${path}` })),
  ];
}

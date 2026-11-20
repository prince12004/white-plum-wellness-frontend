import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

interface CmsSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
}

interface Fallback {
  title: string;
  description?: string;
  path: string;
  /** For the homepage, whose title doesn't take the "| site name" suffix. */
  absoluteTitle?: boolean;
}

/** What the admin set in Pages/SEO Management, over the page's own defaults. */
export function buildCmsMetadata(seo: CmsSeo, fallback: Fallback): Metadata {
  return pageMetadata({
    title: seo.metaTitle || fallback.title,
    description: seo.metaDescription || fallback.description,
    path: fallback.path,
    canonical: seo.canonicalUrl,
    image: seo.ogImage,
    keywords: seo.metaKeywords,
    noIndex: seo.noIndex,
    absoluteTitle: fallback.absoluteTitle,
  });
}

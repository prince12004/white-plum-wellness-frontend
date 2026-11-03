import type { Metadata } from 'next';

interface CmsSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
}

/** Only sets what the admin filled in, so anything else falls back to the root layout's defaults. */
export function buildCmsMetadata(seo: CmsSeo): Metadata {
  return {
    ...(seo.metaTitle && { title: seo.metaTitle }),
    ...(seo.metaDescription && { description: seo.metaDescription }),
    ...(seo.metaKeywords && { keywords: seo.metaKeywords }),
    ...(seo.ogImage && { openGraph: { images: [seo.ogImage] } }),
    ...(seo.canonicalUrl && { alternates: { canonical: seo.canonicalUrl } }),
    ...(seo.noIndex && { robots: { index: false, follow: false } }),
  };
}

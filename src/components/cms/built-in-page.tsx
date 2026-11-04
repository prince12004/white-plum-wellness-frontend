import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CmsSection, CustomPage } from '@white/types';
import { CmsSections } from '@/components/cms/section-renderer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ApiNotFoundError, apiGet } from '@/lib/api';
import { buildCmsMetadata } from '@/lib/cms/metadata';
import { resolvePageSections } from '@/lib/cms/sections';

/** Null when the API can't be reached — the page then renders its built-in content rather than an error.
 * Uncached (revalidate 0): Next's fetch cache keeps the last 200 when the API starts returning 404,
 * so a cached read would keep an unpublished page live. */
async function getBuiltInPage(slug: string): Promise<CustomPage | null> {
  try {
    return await apiGet<CustomPage>(`/custom-pages/${slug}`, 0);
  } catch (err) {
    if (err instanceof ApiNotFoundError) notFound();
    return null;
  }
}

export async function builtInMetadata(slug: string): Promise<Metadata> {
  const page = await getBuiltInPage(slug);
  return page ? buildCmsMetadata({ ...page, metaTitle: page.metaTitle || page.title }) : {};
}

/** A page with its own route whose content, SEO and publish status come from Pages Management. */
export async function BuiltInPage({ slug, label }: { slug: string; label: string }) {
  const page = await getBuiltInPage(slug);
  const sections: CmsSection[] = resolvePageSections(page ?? { sections: undefined, systemKey: slug, body: '' });
  return (
    <>
      <Breadcrumb items={[{ label }]} />
      <CmsSections sections={sections} />
    </>
  );
}

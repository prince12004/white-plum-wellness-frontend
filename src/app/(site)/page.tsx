import type { Metadata } from 'next';
import { CmsSections } from '@/components/cms/section-renderer';
import { getHomepageContent } from '@/data/homepage-content';
import { buildCmsMetadata } from '@/lib/cms/metadata';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/seo';
import { resolveHomepageSections } from '@/lib/cms/sections';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsMetadata(await getHomepageContent(), { title: HOME_TITLE, description: HOME_DESCRIPTION, path: '/', absoluteTitle: true });
}

export default async function HomePage() {
  const home = await getHomepageContent();
  return <CmsSections sections={resolveHomepageSections(home)} />;
}

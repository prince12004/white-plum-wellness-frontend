import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CustomPage } from '@white/types';
import { CmsSections } from '@/components/cms/section-renderer';
import { Footer } from '@/components/layout/footer';
import { WhatsappFloatButton } from '@/components/layout/whatsapp-float-button';
import { MotionProvider } from '@/components/ui/motion-provider';
import { ApiNotFoundError, apiGet } from '@/lib/api';
import { buildCmsMetadata } from '@/lib/cms/metadata';
import { resolvePageSections } from '@/lib/cms/sections';
import SiteLayout from '../(site)/layout';
import { LandingMobileBar } from '../skin-treatment/_components/landing-mobile-bar';
import { LandingTopBar } from '../skin-treatment/_components/landing-top-bar';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

async function getPublishedPage(slug: string): Promise<CustomPage> {
  try {
    return await apiGet<CustomPage>(`/custom-pages/${encodeURIComponent(slug)}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPublishedPage((await params).slug);
  return buildCmsMetadata({ ...page, metaTitle: page.metaTitle || page.title });
}

/** Every page in Pages Management. Sits outside (site) because the 'landing' layout
 * deliberately skips the site nav — its conversion-focused top bar and sticky CTA bar replace it. */
export default async function CmsPage({ params }: Props) {
  const page = await getPublishedPage((await params).slug);
  const sections = <CmsSections sections={resolvePageSections(page)} />;

  if (page.layout !== 'landing') return <SiteLayout>{sections}</SiteLayout>;

  return (
    <MotionProvider>
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <LandingTopBar service={page.title} />
        {sections}
        <Footer />
        <WhatsappFloatButton />
        <LandingMobileBar service={page.title} />
      </div>
    </MotionProvider>
  );
}

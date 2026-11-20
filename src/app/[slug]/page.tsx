import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CustomPage } from '@white/types';
import { CmsSections } from '@/components/cms/section-renderer';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Footer } from '@/components/layout/footer';
import { WhatsappFloatButton } from '@/components/layout/whatsapp-float-button';
import { MotionProvider } from '@/components/ui/motion-provider';
import { ApiNotFoundError, apiGet } from '@/lib/api';
import { buildCmsMetadata } from '@/lib/cms/metadata';
import { resolvePageSections, sectionContent } from '@/lib/cms/sections';
import { breadcrumbSchema } from '@/lib/seo';
import SiteLayout from '../(site)/layout';
import { LandingMobileBar } from '../skin-treatment/_components/landing-mobile-bar';
import { LandingTopBar } from '../skin-treatment/_components/landing-top-bar';

// Uncached: Next's fetch cache keeps the last 200 when the API starts returning 404,
// so a cached read would keep an unpublished or renamed page live.
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

async function getPublishedPage(slug: string): Promise<CustomPage> {
  try {
    return await apiGet<CustomPage>(`/custom-pages/${encodeURIComponent(slug)}`, 0);
  } catch (err) {
    if (err instanceof ApiNotFoundError) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPublishedPage((await params).slug);
  return buildCmsMetadata(page, { title: page.title, path: `/${page.slug}` });
}

/** Every page in Pages Management. Sits outside (site) because the 'landing' layout
 * deliberately skips the site nav — its conversion-focused top bar and sticky CTA bar replace it. */
export default async function CmsPage({ params }: Props) {
  const page = await getPublishedPage((await params).slug);
  const resolved = resolvePageSections(page);
  const sections = <CmsSections sections={resolved} />;

  if (page.layout !== 'landing') {
    return (
      <SiteLayout>
        <Breadcrumb items={[{ label: page.title }]} />
        {sections}
      </SiteLayout>
    );
  }

  // The sticky bar repeats the page's own hero buttons.
  const hero = sectionContent('landing-hero', resolved.find((section) => section.type === 'landing-hero')?.content);

  return (
    <MotionProvider>
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {/* Landing pages hide site navigation, so the trail is only given to search engines. */}
        <JsonLd data={breadcrumbSchema([{ label: page.title }])} />
        <LandingTopBar service={page.title} />
        {sections}
        <Footer />
        <WhatsappFloatButton />
        <LandingMobileBar service={page.title} ctaLabel={hero.ctaLabel} whatsappLabel={hero.whatsappLabel} />
      </div>
    </MotionProvider>
  );
}

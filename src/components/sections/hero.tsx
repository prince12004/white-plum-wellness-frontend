import { getHomepageContent } from '@/data/homepage-content';
import { HeroClient } from './hero-client';

export async function Hero() {
  const content = await getHomepageContent();
  return <HeroClient slides={content.heroSlides} ctaLabel={content.heroCtaLabel} />;
}

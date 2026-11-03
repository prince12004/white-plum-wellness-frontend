import { sectionContent, type SectionProps } from '@/lib/cms/sections';
import { HeroClient } from './hero-client';

export function Hero({ content }: SectionProps) {
  return <HeroClient content={sectionContent('hero', content)} />;
}

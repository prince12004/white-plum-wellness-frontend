import { Container, Section, SectionHeading } from '@/components/ui/container';
import { FaqAccordion } from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export function LandingFaq({ content }: SectionProps) {
  const c = sectionContent('landing-faq', content);
  return (
    <Section tone="muted">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <ScrollReveal>
          <FaqAccordion items={c.items} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

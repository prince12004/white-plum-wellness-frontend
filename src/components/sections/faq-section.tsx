import { Container, Section, SectionHeading } from '@/components/ui/container';
import { FaqAccordion } from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getHomepageFaqs } from '@/data/faqs';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function FaqSection({ content }: SectionProps) {
  const c = sectionContent('faq', content);
  const homepageFaqs = await getHomepageFaqs();
  return (
    <Section tone="muted">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <ScrollReveal>
          <FaqAccordion items={homepageFaqs} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

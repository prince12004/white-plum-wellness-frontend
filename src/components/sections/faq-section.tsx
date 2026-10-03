import { Container, Section, SectionHeading } from '@/components/ui/container';
import { FaqAccordion } from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getHomepageFaqs } from '@/data/faqs';

export async function FaqSection() {
  const homepageFaqs = await getHomepageFaqs();
  return (
    <Section tone="muted">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
        <ScrollReveal>
          <FaqAccordion items={homepageFaqs} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

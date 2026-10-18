import { Container, Section, SectionHeading } from '@/components/ui/container';
import { FaqAccordion } from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const faqs = [
  {
    question: 'What is the best treatment for acne scars?',
    answer:
      'It depends on the type and depth of scarring — our dermatologists typically recommend a combination of chemical peels, microneedling, or laser resurfacing after an in-person assessment.',
  },
  {
    question: 'Is HydraFacial safe for sensitive skin?',
    answer:
      'Yes — HydraFacial is a gentle, non-invasive treatment suitable for most skin types, including sensitive skin. Your dermatologist will confirm suitability during your consultation.',
  },
  {
    question: 'How many sessions are needed for pigmentation treatment?',
    answer:
      'Most patients see visible improvement over 4–6 sessions, spaced 2–3 weeks apart, though this varies by the type and depth of pigmentation.',
  },
  {
    question: 'Do you offer treatments for mole or wart removal?',
    answer:
      'Yes — we offer safe, precise mole, wart, and skin tag removal procedures performed by certified dermatologists.',
  },
  {
    question: 'Is there any downtime after a chemical peel?',
    answer:
      'Most peels involve minimal downtime — mild redness or peeling for a few days. Your dermatologist will share specific aftercare instructions based on the peel strength used.',
  },
];

export function LandingFaq() {
  return (
    <Section tone="muted">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
        <ScrollReveal>
          <FaqAccordion items={faqs} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

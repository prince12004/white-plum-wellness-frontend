import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ConcernCard } from '@/components/cards/concern-card';
import { getAllConcerns } from '@/data/concerns';

export async function ConcernsSection() {
  const concerns = await getAllConcerns();
  const featured = concerns.slice(0, 11);

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Personalised Care" title="Tell Us Your Concern" description="Start from what's actually bothering you — we'll guide you to the right treatment from there." />
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {featured.map((concern, i) => (
            <ScrollReveal key={concern.slug} delay={(i % 6) * 60} className="w-full sm:w-auto">
              <ConcernCard concern={concern} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

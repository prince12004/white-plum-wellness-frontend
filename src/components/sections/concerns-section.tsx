import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ConcernCard } from '@/components/cards/concern-card';
import { getAllConcerns } from '@/data/concerns';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function ConcernsSection({ content }: SectionProps) {
  const c = sectionContent('concerns', content);
  const concerns = await getAllConcerns();
  const featured = concerns.slice(0, 11);

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
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

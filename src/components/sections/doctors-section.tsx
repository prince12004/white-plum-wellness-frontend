import { Container, Section, SectionHeading } from '@/components/ui/container';
import { DoctorsCarousel } from '@/components/doctors-carousel';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getAllDoctors } from '@/data/doctors';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function DoctorsSection({ content }: SectionProps) {
  const c = sectionContent('doctors', content);
  const doctors = await getAllDoctors();
  return (
    <Section tone="muted">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <ScrollReveal>
          <DoctorsCarousel doctors={doctors} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

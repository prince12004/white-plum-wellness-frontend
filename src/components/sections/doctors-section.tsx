import { Container, Section, SectionHeading } from '@/components/ui/container';
import { DoctorsCarousel } from '@/components/doctors-carousel';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getAllDoctors } from '@/data/doctors';

export async function DoctorsSection() {
  const doctors = await getAllDoctors();
  return (
    <Section tone="muted">
      <Container>
        <SectionHeading eyebrow="Meet the Team" title="Our Doctors" description="Board-certified dermatologists and aesthetic specialists, each with a distinct area of focus." />
        <ScrollReveal>
          <DoctorsCarousel doctors={doctors} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

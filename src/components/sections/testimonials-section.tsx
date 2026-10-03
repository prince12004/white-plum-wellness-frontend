import { Container, Section, SectionHeading } from '@/components/ui/container';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getFeaturedTestimonials } from '@/data/testimonials';

export async function TestimonialsSection() {
  const testimonials = await getFeaturedTestimonials();
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Patient Stories" title="What Our Patients Say" description="Real experiences from patients across our clinics." />
        <ScrollReveal delay={100}>
          <TestimonialsCarousel testimonials={testimonials} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

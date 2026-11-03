import { Container, Section, SectionHeading } from '@/components/ui/container';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getFeaturedTestimonials } from '@/data/testimonials';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function TestimonialsSection({ content }: SectionProps) {
  const c = sectionContent('testimonials', content);
  const testimonials = await getFeaturedTestimonials();
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <ScrollReveal delay={100}>
          <TestimonialsCarousel testimonials={testimonials} />
        </ScrollReveal>
      </Container>
    </Section>
  );
}

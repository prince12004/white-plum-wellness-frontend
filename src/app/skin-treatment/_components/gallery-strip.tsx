import Image from 'next/image';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ImageReveal } from '@/components/ui/motion';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export function GalleryStrip({ content }: SectionProps) {
  const c = sectionContent('landing-gallery', content);
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {c.items.map((img, i) =>
            img.image ? (
              <ImageReveal key={i} delay={i * 80} className="relative aspect-square rounded-2xl">
                <Image src={img.image} alt={img.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              </ImageReveal>
            ) : null,
          )}
        </div>
      </Container>
    </Section>
  );
}

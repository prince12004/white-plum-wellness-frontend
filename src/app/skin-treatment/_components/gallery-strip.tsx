import Image from 'next/image';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ImageReveal } from '@/components/ui/motion';
import { placeholderImage } from '@/data/images';

const galleryImages = [
  { seed: 'gallery-clinic-1', alt: 'Clinic reception' },
  { seed: 'gallery-clinic-2', alt: 'Treatment room' },
  { seed: 'gallery-clinic-3', alt: 'Consultation room' },
  { seed: 'gallery-clinic-4', alt: 'Waiting lounge' },
];

export function GalleryStrip() {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Inside Our Clinic" title="A Calm, Clinical Space" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {galleryImages.map((img, i) => (
            <ImageReveal key={img.seed} delay={i * 80} className="relative aspect-square rounded-2xl">
              <Image
                src={placeholderImage(img.seed, 500, 500)}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </ImageReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import Image from 'next/image';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { ImageReveal, Stagger, FadeUp } from '@/components/ui/motion';
import { whyChooseUs } from '@/data/content';
import { placeholderImage } from '@/data/images';

export function WhyChooseUs() {
  return (
    <Section tone="muted">
      <Container>
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
          <ImageReveal className="relative min-h-[320px] w-full rounded-2xl lg:min-h-0">
            <Image
              src={placeholderImage('why-choose-us', 900, 900)}
              alt="Our clinic team"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </ImageReveal>
          <div>
            <SectionHeading
              eyebrow="Why White Plum"
              title="Why Choose Us"
              description="A clinic built around honest guidance, qualified doctors, and results you can actually see."
              align="left"
              className="mb-8"
            />
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2" staggerDelay={0.08}>
              {whyChooseUs.map((item) => (
                <FadeUp key={item.title} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-600">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-base font-medium text-charcoal-900">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal-500">{item.description}</p>
                  </div>
                </FadeUp>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </Section>
  );
}

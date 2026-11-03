import Image from 'next/image';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ImageReveal, Stagger, FadeUp } from '@/components/ui/motion';
import { CmsIcon } from '@/lib/cms/icons';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export function WhySkinSection({ content }: SectionProps) {
  const c = sectionContent('landing-why', content);
  return (
    <Section tone="muted">
      <Container>
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
          <ImageReveal className="relative min-h-[320px] w-full rounded-2xl lg:min-h-0">
            {c.image && <Image src={c.image} alt={c.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />}
          </ImageReveal>
          <div>
            <SectionHeading
              eyebrow={c.eyebrow}
              title={c.title}
              description={c.description}
              align="left"
              className="mb-8"
            />
            <Stagger className="flex flex-col gap-4" staggerDelay={0.1}>
              {c.items.map((step) => (
                <FadeUp
                  key={step.title}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-600">
                    <CmsIcon name={step.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-base font-medium text-charcoal-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal-500">{step.description}</p>
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

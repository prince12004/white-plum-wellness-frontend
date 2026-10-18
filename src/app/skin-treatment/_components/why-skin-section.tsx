import Image from 'next/image';
import { ClipboardCheck, Sparkles, Target } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ImageReveal, Stagger, FadeUp } from '@/components/ui/motion';
import { placeholderImage } from '@/data/images';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Assess',
    description: 'A thorough skin consultation to understand your concerns and skin type.',
  },
  {
    icon: Target,
    title: 'Treat',
    description: 'A personalised, dermatologist-led protocol using the most effective options for you.',
  },
  {
    icon: Sparkles,
    title: 'Transform',
    description: 'Visible, lasting results — with clear aftercare guidance at every step.',
  },
];

export function WhySkinSection() {
  return (
    <Section tone="muted">
      <Container>
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
          <ImageReveal className="relative min-h-[320px] w-full rounded-2xl lg:min-h-0">
            <Image
              src={placeholderImage('why-choose-us-skin', 900, 900)}
              alt="Dermatologist consultation"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </ImageReveal>
          <div>
            <SectionHeading
              eyebrow="Our Process"
              title="How We Get You Results"
              description="No generic facials — every plan starts with an actual skin assessment from a qualified dermatologist."
              align="left"
              className="mb-8"
            />
            <Stagger className="flex flex-col gap-4" staggerDelay={0.1}>
              {steps.map((step) => (
                <FadeUp
                  key={step.title}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-600">
                    <step.icon className="h-5 w-5" />
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

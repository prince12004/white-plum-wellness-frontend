import { BadgeCheck, HeartHandshake, Microscope, Stethoscope } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Stagger, FadeUp } from '@/components/ui/motion';

const usps = [
  { icon: Stethoscope, label: 'Expert Dermatologists' },
  { icon: Microscope, label: 'Advanced Technology' },
  { icon: HeartHandshake, label: 'Patient-First Care' },
  { icon: BadgeCheck, label: 'Certified & Safe' },
];

export function LandingUspBar() {
  return (
    <section className="border-b border-ivory-200 bg-white py-8">
      <Container>
        <Stagger className="grid grid-cols-2 gap-6 sm:grid-cols-4" staggerDelay={0.08}>
          {usps.map(({ icon: UspIcon, label }) => (
            <FadeUp key={label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-peach-50 text-peach-600">
                <UspIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-charcoal-800">{label}</p>
            </FadeUp>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { BookingCta } from '@/components/cms/booking-cta';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export function FinalCta({ content }: SectionProps) {
  const c = sectionContent('final-cta', content);
  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-14 text-center text-white">
      {c.backgroundImage && <Image src={c.backgroundImage} alt="" fill sizes="100vw" className="object-cover opacity-30" />}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-peach-500/30 blur-[110px]" />
        <div className="absolute right-1/4 bottom-0 h-80 w-80 translate-x-1/2 rounded-full bg-gold-400/30 blur-[110px]" />
      </div>
      <Container className="relative max-w-2xl">
        <ScrollReveal>
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-white/5">
            <Sparkles className="h-5 w-5 text-gold-300" />
          </span>
          <h2 className="mt-5 font-display text-4xl font-medium sm:text-5xl">
            {c.title}{' '}
            <span className="bg-gradient-to-r from-peach-300 via-gold-200 to-gold-300 bg-clip-text italic text-transparent">
              {c.highlight}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-ivory-100/70">
            {c.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BookingCta size="lg" href={c.ctaHref}>
              {c.ctaLabel}
            </BookingCta>
            {c.whatsappLabel && (
              <WhatsappCtaLink className="h-12 gap-2 px-6 text-base">
                <WhatsappIcon className="h-5 w-5" />
                {c.whatsappLabel}
              </WhatsappCtaLink>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

import { Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-14 text-center text-white">
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
            Your Skin Deserves{' '}
            <span className="bg-gradient-to-r from-peach-300 via-gold-200 to-gold-300 bg-clip-text italic text-transparent">
              Expert Care.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-ivory-100/70">
            Book a complimentary consultation and get a personalised plan from a qualified dermatologist — no
            pressure, no obligation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <BookAppointmentButton size="lg">Book Consultation</BookAppointmentButton>
            <WhatsappCtaLink className="h-12 gap-2 px-6 text-base">
              <WhatsappIcon className="h-5 w-5" />
              WhatsApp Us
            </WhatsappCtaLink>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

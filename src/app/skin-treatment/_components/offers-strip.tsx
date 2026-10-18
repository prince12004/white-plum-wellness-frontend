import { Tag } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getAllOffers } from '@/data/offers';

const SKIN_KEYWORDS = ['skin', 'pigmentation', 'acne', 'hydrafacial', 'glow', 'facial', 'consultation', 'first visit'];

export async function OffersStrip() {
  const offers = await getAllOffers();
  const relevant = offers
    .filter((o) => SKIN_KEYWORDS.some((kw) => o.title.toLowerCase().includes(kw)))
    .slice(0, 4);

  if (relevant.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Current Offers" title="Special Offers on Skin Care" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relevant.map((offer, i) => (
            <ScrollReveal key={offer.id} delay={i * 80}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-gold-300/60 bg-gold-50/50 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <Tag className="h-4 w-4" />
                </span>
                <p className="flex-1 font-display text-base font-semibold leading-snug text-charcoal-900">
                  {offer.title}
                </p>
                {offer.originalPrice && offer.offerPrice && (
                  <p className="text-sm">
                    <span className="text-charcoal-400 line-through">₹{offer.originalPrice.toLocaleString('en-IN')}</span>{' '}
                    <span className="font-semibold text-peach-600">₹{offer.offerPrice.toLocaleString('en-IN')}</span>
                  </p>
                )}
                <WhatsappCtaLink context={{ offer: offer.title }} className="h-9 w-full text-xs">
                  Claim This Offer
                </WhatsappCtaLink>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

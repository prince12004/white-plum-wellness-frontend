import Image from 'next/image';
import type { Service } from '@/data/services';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

/** The card's visual content only, no reveal-on-scroll wrapper — used directly
 * inside the desktop carousel (where embla handles positioning) and wrapped in
 * ScrollReveal for the mobile/tablet grid. */
export function TreatmentOfferCardContent({ service }: { service: Service }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)]">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-charcoal-900">{service.name}</h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-charcoal-500">{service.shortDescription}</p>
        {service.startingPrice > 0 && (
          <p className="text-sm font-medium text-charcoal-700">
            Starting at <span className="text-peach-600">₹{service.startingPrice.toLocaleString('en-IN')}</span>
          </p>
        )}
        <WhatsappCtaLink context={{ service: service.name }} className="mt-2 h-9 w-full gap-1.5 text-xs">
          <WhatsappIcon className="h-3.5 w-3.5" />
          Book Free Consultation
        </WhatsappCtaLink>
      </div>
    </div>
  );
}

export function TreatmentOfferCard({ service, delay = 0 }: { service: Service; delay?: number }) {
  return (
    <ScrollReveal delay={delay}>
      <TreatmentOfferCardContent service={service} />
    </ScrollReveal>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@white/ui';
import type { Offer } from '@/data/offers';
import { SaveButton } from '@/components/booking/save-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)]">
      <Link href={`/offers/${offer.slug}`} className="relative block h-52 w-full overflow-hidden">
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 to-transparent" />
        <Badge variant="warning" className="absolute left-3 top-3">{offer.offerType}</Badge>
      </Link>
      <SaveButton itemType="offer" itemSlug={offer.slug} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link href={`/offers/${offer.slug}`}>
          <h3 className="font-display text-lg font-medium text-charcoal-900 hover:text-peach-600">{offer.title}</h3>
        </Link>
        <p className="flex-1 text-sm leading-relaxed text-charcoal-500 sm:text-base">{offer.description}</p>
        <p className="text-xs text-charcoal-300">Valid until {new Date(offer.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <div className="mt-1 flex items-center gap-2">
          <Link
            href={`/offers/${offer.slug}`}
            className="group/link inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-peach-500 text-sm font-medium text-peach-600 transition-colors hover:bg-peach-50"
          >
            Explore Offer
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
          <WhatsappCtaLink
            context={{ offer: offer.title }}
            variant="icon"
            className="h-9 w-9 shrink-0"
            aria-label={`WhatsApp about ${offer.title}`}
          >
            <WhatsappIcon className="h-6 w-6" />
          </WhatsappCtaLink>
        </div>
      </div>
    </div>
  );
}

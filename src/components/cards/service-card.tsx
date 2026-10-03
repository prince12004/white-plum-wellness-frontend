import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@white/ui';
import type { Service } from '@/data/services';
import { getCategoryBySlug } from '@/data/categories';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';

export function ServiceCard({ service }: { service: Service }) {
  const category = getCategoryBySlug(service.categorySlug);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)]">
      <Link href={`/services/${service.categorySlug}/${service.slug}`} className="relative block h-52 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {service.popular && <Badge variant="peach" className="absolute left-3 top-3">Popular</Badge>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {category && <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">{category.name}</span>}
        <Link href={`/services/${service.categorySlug}/${service.slug}`}>
          <h3 className="font-display text-lg font-semibold text-charcoal-900 hover:text-peach-600">{service.name}</h3>
        </Link>
        <p className="flex-1 text-sm leading-relaxed text-charcoal-500 sm:text-base">{service.shortDescription}</p>
        {service.startingPrice > 0 && (
          <p className="text-sm font-medium text-charcoal-700">
            Starting at <span className="text-peach-600">₹{service.startingPrice.toLocaleString('en-IN')}</span>
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <Link
            href={`/services/${service.categorySlug}/${service.slug}`}
            className="group/link inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-peach-500 px-3 text-sm font-medium text-peach-600 transition-colors hover:bg-peach-50"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
          <WhatsappCtaLink
            context={{ service: service.name }}
            variant="icon"
            className="h-9 w-9 shrink-0"
            aria-label={`WhatsApp about ${service.name}`}
          >
            <WhatsappIcon className="h-6 w-6" />
          </WhatsappCtaLink>
        </div>
      </div>
    </div>
  );
}

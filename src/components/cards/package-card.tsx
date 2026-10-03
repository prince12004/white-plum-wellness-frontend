import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { TreatmentPackage } from '@/data/packages';
import { SaveButton } from '@/components/booking/save-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';

export function PackageCard({ pkg }: { pkg: TreatmentPackage }) {
  const discount = Math.round(((pkg.originalPrice - pkg.offerPrice) / pkg.originalPrice) * 100);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)]">
      <Link href={`/packages/${pkg.slug}`} className="relative block h-52 w-full overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-white">
          {discount}% OFF
        </span>
      </Link>
      <SaveButton itemType="package" itemSlug={pkg.slug} className="absolute left-3 top-3" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/packages/${pkg.slug}`}>
          <h3 className="font-display text-lg font-semibold text-charcoal-900 hover:text-peach-600">{pkg.name}</h3>
        </Link>
        <ul className="flex flex-col gap-1 text-sm text-charcoal-500">
          {pkg.treatmentsIncluded.slice(0, 3).map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" />
              {t}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs text-charcoal-500">
          <span>{pkg.sessions}</span>
          <span>{pkg.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-peach-600">₹{pkg.offerPrice.toLocaleString('en-IN')}</span>
          <span className="text-sm text-charcoal-300 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Link
            href={`/packages/${pkg.slug}`}
            className="group/link inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-peach-500 text-sm font-medium text-white transition-colors hover:bg-peach-600"
          >
            View Package
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
          <WhatsappCtaLink
            context={{ package: pkg.name }}
            variant="icon"
            className="h-10 w-10 shrink-0"
            aria-label={`WhatsApp about ${pkg.name}`}
          >
            <WhatsappIcon className="h-6 w-6" />
          </WhatsappCtaLink>
        </div>
      </div>
    </div>
  );
}

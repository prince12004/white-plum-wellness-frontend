import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import type { Clinic } from '@/data/clinics';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';

export function ClinicCard({ clinic }: { clinic: Clinic }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)] sm:flex-row">
      <Link href={`/clinics/${clinic.slug}`} className="relative block h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:w-56">
        <Image
          src={clinic.image}
          alt={clinic.name}
          fill
          sizes="(max-width: 768px) 100vw, 224px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link href={`/clinics/${clinic.slug}`}>
          <h3 className="font-display text-lg font-semibold text-charcoal-900 hover:text-peach-600">{clinic.name}</h3>
        </Link>
        <p className="flex items-start gap-2 text-sm text-charcoal-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" />
          {clinic.address}
        </p>
        <p className="flex items-center gap-2 text-sm text-charcoal-500">
          <Phone className="h-4 w-4 shrink-0 text-peach-500" />
          {clinic.phone}
        </p>
        <p className="flex items-center gap-2 text-sm text-charcoal-500">
          <Clock className="h-4 w-4 shrink-0 text-peach-500" />
          {clinic.openingHours[0]?.day}: {clinic.openingHours[0]?.hours}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={`/clinics/${clinic.slug}`}
            className="group/link inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-peach-500 px-4 text-sm font-medium text-peach-600 transition-colors hover:bg-peach-50"
          >
            View Clinic
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
          <WhatsappCtaLink context={{ clinic: clinic.name, city: clinic.city }} className="h-9 px-4">
            WhatsApp
          </WhatsappCtaLink>
        </div>
      </div>
    </div>
  );
}

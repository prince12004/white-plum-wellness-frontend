'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Select } from '@white/ui';
import { Container, SectionHeading } from '@/components/ui/container';
import { ClinicCard } from '@/components/cards/clinic-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ImageReveal } from '@/components/ui/motion';
import type { Clinic } from '@/data/clinics';
import { placeholderImage } from '@/data/images';

export function ClinicLocatorClient({ clinics, cities }: { clinics: Clinic[]; cities: string[] }) {
  const [selectedCity, setSelectedCity] = useState('all');

  const filtered = useMemo(
    () => (selectedCity === 'all' ? clinics : clinics.filter((c) => c.city === selectedCity)),
    [selectedCity, clinics],
  );

  return (
    <Container>
      <SectionHeading eyebrow="Visit Us" title="Find Your Clinic" description="Five clinics, one consistent standard of care — choose the one closest to you." />

      <ScrollReveal className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <label htmlFor="city-filter" className="text-sm font-medium text-charcoal-700">
          Filter by city
        </label>
        <Select
          id="city-filter"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-56"
        >
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-3">
          {filtered.map((clinic, i) => (
            <ScrollReveal key={clinic.slug} delay={i * 80}>
              <ClinicCard clinic={clinic} />
            </ScrollReveal>
          ))}
        </div>
        <ImageReveal delay={150} className="relative hidden rounded-2xl bg-ivory-200 lg:col-span-2 lg:block">
          <Image src={placeholderImage('map-placeholder', 700, 900)} alt="Map of clinic locations" fill sizes="40vw" className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/20">
            <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-charcoal-700 shadow">
              <MapPin className="h-4 w-4 text-peach-500" />
              Interactive map coming with the live clinic data
            </div>
          </div>
        </ImageReveal>
      </div>
    </Container>
  );
}

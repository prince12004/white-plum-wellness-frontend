'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Select } from '@white/ui';
import { Container, SectionHeading } from '@/components/ui/container';
import { ClinicCard } from '@/components/cards/clinic-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ImageReveal } from '@/components/ui/motion';
import type { Clinic } from '@/data/clinics';
import type { SectionContent } from '@/lib/cms/sections';

export function ClinicLocatorClient({
  clinics,
  cities,
  content,
}: {
  clinics: Clinic[];
  cities: string[];
  content: SectionContent<'clinic-locator'>;
}) {
  const [selectedCity, setSelectedCity] = useState('all');

  const filtered = useMemo(
    () => (selectedCity === 'all' ? clinics : clinics.filter((c) => c.city === selectedCity)),
    [selectedCity, clinics],
  );

  return (
    <Container>
      <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} />

      <ScrollReveal className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <label htmlFor="city-filter" className="text-sm font-medium text-charcoal-700">
          {content.filterLabel}
        </label>
        <Select
          id="city-filter"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-56"
        >
          <option value="all">{content.allCitiesLabel}</option>
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
          {content.image && <Image src={content.image} alt="Our clinic locations" fill sizes="40vw" className="object-cover" />}
        </ImageReveal>
      </div>
    </Container>
  );
}

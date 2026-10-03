'use client';

import { useMemo, useState } from 'react';
import { Select } from '@white/ui';
import { ClinicCard } from '@/components/cards/clinic-card';
import { Stagger, FadeUp } from '@/components/ui/motion';
import type { Clinic } from '@/data/clinics';

export function ClinicsFilter({ clinics, cities }: { clinics: Clinic[]; cities: string[] }) {
  const [selectedCity, setSelectedCity] = useState('all');

  const filtered = useMemo(
    () => (selectedCity === 'all' ? clinics : clinics.filter((c) => c.city === selectedCity)),
    [selectedCity, clinics],
  );

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <label htmlFor="city-filter" className="text-sm font-medium text-charcoal-700">
          Filter by city
        </label>
        <Select id="city-filter" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-56">
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </div>
      <Stagger key={selectedCity} className="flex flex-col gap-4" staggerDelay={0.06}>
        {filtered.map((clinic) => (
          <FadeUp key={clinic.slug}>
            <ClinicCard clinic={clinic} />
          </FadeUp>
        ))}
      </Stagger>
    </>
  );
}

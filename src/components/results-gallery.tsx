'use client';

import { useMemo, useState } from 'react';
import { cn } from '@white/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@white/ui';
import { ResultCard } from '@/components/cards/result-card';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { Stagger, FadeUp } from '@/components/ui/motion';
import type { BeforeAfterResult } from '@/data/before-after';
import type { Doctor } from '@/data/doctors';
import type { Clinic } from '@/data/clinics';

interface ResultsGalleryProps {
  results: BeforeAfterResult[];
  categories: string[];
  doctors: Doctor[];
  clinics: Clinic[];
}

export function ResultsGallery({ results, categories, doctors, clinics }: ResultsGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState<BeforeAfterResult | null>(null);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? results : results.filter((r) => r.category === activeCategory)),
    [activeCategory, results],
  );

  const doctor = selected ? doctors.find((d) => d.slug === selected.doctorSlug) : undefined;
  const clinic = selected ? clinics.find((c) => c.slug === selected.clinicSlug) : undefined;

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2.5 px-4">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
              activeCategory === cat
                ? 'bg-gradient-to-r from-peach-500 to-peach-600 text-white shadow-[0_8px_20px_-8px_rgba(142,75,92,0.5)]'
                : 'border border-ivory-200 bg-white text-charcoal-600 hover:-translate-y-0.5 hover:border-peach-300 hover:text-peach-700',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <Stagger key={activeCategory} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
        {filtered.map((result) => (
          <FadeUp key={result.id}>
            <ResultCard result={result} onClick={() => setSelected(result)} />
          </FadeUp>
        ))}
      </Stagger>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <BeforeAfterSlider beforeImage={selected.beforeImage} afterImage={selected.afterImage} />
              <p className="mt-4 text-sm text-charcoal-600">{selected.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-charcoal-400">Sessions</dt>
                  <dd className="font-medium text-charcoal-900">{selected.sessions}</dd>
                </div>
                <div>
                  <dt className="text-xs text-charcoal-400">Duration</dt>
                  <dd className="font-medium text-charcoal-900">{selected.duration}</dd>
                </div>
                {doctor && (
                  <div>
                    <dt className="text-xs text-charcoal-400">Doctor</dt>
                    <dd className="font-medium text-charcoal-900">{doctor.name}</dd>
                  </div>
                )}
                {clinic && (
                  <div>
                    <dt className="text-xs text-charcoal-400">Clinic</dt>
                    <dd className="font-medium text-charcoal-900">{clinic.name}</dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@white/ui';
import { DoctorCard } from '@/components/cards/doctor-card';
import type { Doctor } from '@/data/doctors';

export function DoctorsCarousel({ doctors }: { doctors: Doctor[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-6 flex">
          {doctors.map((doctor) => (
            <div key={doctor.slug} className="min-w-0 shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 lg:basis-1/4">
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous doctor"
          onClick={scrollPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-200 text-charcoal-700 transition-colors hover:border-peach-300 hover:bg-peach-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {doctors.map((d, i) => (
            <span
              key={d.slug}
              className={cn('h-1.5 rounded-full transition-all', i === selectedIndex ? 'w-6 bg-peach-500' : 'w-1.5 bg-ivory-200')}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next doctor"
          onClick={scrollNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-200 text-charcoal-700 transition-colors hover:border-peach-300 hover:bg-peach-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

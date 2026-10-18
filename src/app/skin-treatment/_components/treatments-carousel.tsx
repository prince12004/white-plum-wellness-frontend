'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@white/ui';
import type { Service } from '@/data/services';
import { TreatmentOfferCardContent } from './treatment-offer-card';

export function TreatmentsCarousel({ services }: { services: Service[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', slidesToScroll: 1 }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {services.map((service) => (
            <div key={service.slug} className="min-w-0 shrink-0 grow-0 basis-1/4 pl-4">
              <TreatmentOfferCardContent service={service} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous treatments"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-charcoal-700 transition-colors hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {services.map((service, i) => (
            <span key={service.slug} className={cn('h-1.5 w-1.5 rounded-full', i === selectedIndex ? 'bg-peach-500' : 'bg-ivory-200')} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next treatments"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-charcoal-700 transition-colors hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

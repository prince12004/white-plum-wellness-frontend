'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@white/ui';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import type { Testimonial } from '@/data/testimonials';

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
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
        <div className="-ml-4 flex">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={scrollPrev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-charcoal-700 hover:bg-ivory-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {testimonials.map((t, i) => (
            <span key={t.id} className={cn('h-1.5 w-1.5 rounded-full', i === selectedIndex ? 'bg-peach-500' : 'bg-ivory-200')} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={scrollNext}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-charcoal-700 hover:bg-ivory-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

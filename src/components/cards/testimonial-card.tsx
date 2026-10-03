import Image from 'next/image';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/data/testimonials';
import { RatingStars } from '@/components/ui/rating-stars';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
      <Quote className="h-6 w-6 text-peach-300" />
      <RatingStars rating={testimonial.rating} />
      <p className="flex-1 text-sm text-charcoal-700">&ldquo;{testimonial.review}&rdquo;</p>
      <div className="flex items-center gap-3 border-t border-ivory-100 pt-4">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image src={testimonial.photo} alt={testimonial.name} fill sizes="40px" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal-900">{testimonial.name}</p>
          <p className="text-xs text-charcoal-500">
            {testimonial.treatment} · {testimonial.city}
          </p>
        </div>
      </div>
    </div>
  );
}

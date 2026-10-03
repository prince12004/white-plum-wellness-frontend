import { Star } from 'lucide-react';
import { cn } from '@white/ui';

export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('h-4 w-4', i < rating ? 'fill-gold-500 text-gold-500' : 'fill-ivory-200 text-ivory-200')}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

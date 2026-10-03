import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Concern } from '@/data/concerns';
import { Icon } from '@/components/ui/icon';

/** Deliberately not a photo/icon-circle card like CategoryCard or ServiceCard —
 * a compact text-led tag so scanning a wall of concerns doesn't repeat the same
 * card shape used everywhere else on the page. */
export function ConcernCard({ concern }: { concern: Concern }) {
  return (
    <Link
      href={`/concerns/${concern.slug}`}
      className="group flex items-center justify-between gap-3 rounded-full border border-charcoal-900/10 bg-white py-3 pl-5 pr-4 transition-all duration-300 hover:border-charcoal-900 hover:bg-charcoal-900"
    >
      <span className="flex items-center gap-2.5">
        <Icon name={concern.icon} className="h-4 w-4 text-peach-500 group-hover:text-peach-300" />
        <span className="font-display text-sm font-medium text-charcoal-900 group-hover:text-white">
          {concern.name}
        </span>
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-charcoal-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-peach-300" />
    </Link>
  );
}

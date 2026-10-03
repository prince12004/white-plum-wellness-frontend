import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/data/categories';
import { Icon } from '@/components/ui/icon';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/services/${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)]"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 to-transparent" />
        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-peach-600">
          <Icon name={category.icon} className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-semibold text-charcoal-900">{category.name}</h3>
        <p className="flex-1 text-sm text-charcoal-500">{category.shortDescription}</p>
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-peach-600">
          View Treatments
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { cn } from '@white/ui';
import { Stagger, FadeUp } from '@/components/ui/motion';
import { galleryCategories } from '@/data/content';
import type { GalleryItem } from '@/data/content';

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<string>('All');

  const filtered = useMemo(
    () => (active === 'All' ? items : items.filter((g) => g.category === active)),
    [active, items],
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {['All', ...galleryCategories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active === cat ? 'bg-peach-500 text-white' : 'border border-ivory-200 bg-white text-charcoal-600 hover:border-peach-300',
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      <Stagger key={active} className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4" staggerDelay={0.05}>
        {filtered.map((item) => (
          <FadeUp key={item.id} className="group relative overflow-hidden rounded-2xl">
            <Image
              src={item.image}
              alt={item.caption}
              width={400}
              height={400}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-900/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-xs text-white">{item.caption}</p>
            </div>
          </FadeUp>
        ))}
      </Stagger>
    </>
  );
}

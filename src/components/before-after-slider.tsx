'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@white/ui';
import { MoveHorizontal } from 'lucide-react';

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
}: {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const [interacted, setInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-ivory-200',
        className,
      )}
      onMouseDown={(e) => {
        dragging.current = true;
        setInteracted(true);
        updatePosition(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && updatePosition(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => {
        setInteracted(true);
        updatePosition(e.touches[0]?.clientX ?? 0);
      }}
      onTouchMove={(e) => updatePosition(e.touches[0]?.clientX ?? 0)}
    >
      {/* After image — full size, always visible as the base layer.
          unoptimized: these are often hotlinked stock/admin-uploaded URLs on third-party
          hosts (Unsplash, Cloudinary); routing them through Next's server-side image
          proxy adds a single point of failure that times out (504) when the upstream
          host is slow. Serving the original URL directly to the browser avoids that. */}
      <Image src={afterImage} alt={afterLabel} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={false} unoptimized />

      {/* Before image — same full size, masked via clip-path so it never resizes/distorts */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={beforeImage} alt={beforeLabel} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" unoptimized />
      </div>

      <div
        className="absolute inset-y-0 flex w-1 -translate-x-1/2 cursor-ew-resize items-center justify-center bg-white/80"
        style={{ left: `${position}%` }}
        role="slider"
        aria-label="Before and after comparison slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          setInteracted(true);
          if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 5));
          if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 5));
        }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-charcoal-700 shadow-lg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:shadow-[0_0_0_6px_rgba(229,102,144,0.18)]">
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </div>

      {!interacted && (
        <span
          className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-charcoal-900/70 px-3 py-1.5 text-xs font-medium text-white opacity-100 transition-opacity duration-500 group-hover:opacity-0"
          aria-hidden="true"
        >
          Drag to compare
        </span>
      )}

      <span className="absolute left-3 top-3 rounded-full bg-charcoal-900/70 px-3 py-1 text-xs font-medium text-white">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-peach-500/90 px-3 py-1 text-xs font-medium text-white">
        {afterLabel}
      </span>
    </div>
  );
}

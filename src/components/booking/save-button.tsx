'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { cn } from '@white/ui';

interface SaveButtonProps {
  itemType: 'package' | 'offer';
  itemSlug: string;
  className?: string;
}

/** Optimistic save/unsave — doesn't check prior saved-state on load (would mean an
 * extra fetch per card); a logged-out click sends the visitor to log in first. */
export function SaveButton({ itemType, itemSlug, className }: SaveButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      if (!saved) {
        const res = await fetch('/api/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ itemType, itemSlug }),
        });
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.ok) setSaved(true);
      } else {
        const res = await fetch(`/api/favourites/${itemType}/${itemSlug}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) setSaved(false);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? 'Remove from saved' : 'Save for later'}
      aria-pressed={saved}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 bg-white/90 text-charcoal-400 backdrop-blur transition-all hover:border-peach-300 hover:text-peach-600',
        saved && 'border-peach-400 text-peach-500',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4 transition-transform', saved && 'scale-110 fill-current')} />
    </button>
  );
}

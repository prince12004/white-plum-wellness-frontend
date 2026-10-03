import Image from 'next/image';
import { cn } from '@white/ui';

/** The brand logo file at public/logo.png already contains the full "White Plum
 * Wellness" wordmark — rendered on its own, with no extra text lockup beside it. */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="White Plum Wellness"
      width={447}
      height={559}
      priority
      className={cn('h-11 w-auto object-contain sm:h-12 lg:h-14', className)}
    />
  );
}

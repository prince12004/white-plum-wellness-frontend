import { cn } from '@white/ui';

/** Infinite auto-scrolling strip — duplicates its children so the loop is seamless,
 * pauses on hover, and respects prefers-reduced-motion via the `motion-reduce` variant. */
export function Marquee({
  children,
  className,
  durationSeconds = 28,
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  durationSeconds?: number;
  reverse?: boolean;
}) {
  return (
    <div className={cn('group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]', className)}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            'flex shrink-0 items-center gap-12 pr-12',
            'animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none',
            reverse && 'direction-reverse',
          )}
          style={{
            animationDuration: `${durationSeconds}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

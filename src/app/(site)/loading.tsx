import { Skeleton } from '@white/ui';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-24">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

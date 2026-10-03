import { Skeleton } from '@white/ui';

/** Shown instantly on click while a list route's data loads — hero text + a card grid. */
export function ListPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Skeleton className="mx-auto h-3 w-32" />
        <Skeleton className="mx-auto mt-4 h-9 w-72" />
        <Skeleton className="mx-auto mt-4 h-4 w-96" />
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-ivory-200 bg-white">
            <Skeleton className="h-52 w-full rounded-none" />
            <div className="flex flex-col gap-2 p-5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Shown instantly on click while a detail route's data loads — breadcrumb + hero + body. */
export function DetailPageSkeleton() {
  return (
    <div>
      <div className="border-b border-ivory-200 px-4 py-4 sm:px-6 lg:px-8">
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <Skeleton className="mt-6 h-72 w-full rounded-2xl" />
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}

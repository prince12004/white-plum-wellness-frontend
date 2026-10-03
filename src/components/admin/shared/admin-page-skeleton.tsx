function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-ivory-200 ${className ?? ''}`} />;
}

/** Shown instantly the moment any admin nav link is clicked, while the target
 * route compiles/renders — keeps navigation feeling immediate instead of frozen. */
export function AdminPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-7 w-48" />
        </div>
        <Pulse className="h-10 w-28 rounded-xl" />
      </div>
      <div className="rounded-2xl border border-ivory-200 bg-white p-6">
        <Pulse className="mb-4 h-5 w-32" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

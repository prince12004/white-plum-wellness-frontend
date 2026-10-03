import { ArrowRight } from 'lucide-react';
import type { BeforeAfterResult } from '@/data/before-after';
import { BeforeAfterSlider } from '@/components/before-after-slider';

export function ResultCard({ result, onClick }: { result: BeforeAfterResult; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group cardsss flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)]"
    >
      <BeforeAfterSlider beforeImage={result.beforeImage} afterImage={result.afterImage} className="rounded-none rounded-t-2xl" />
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">{result.category}</span>
        <h3 className="font-display text-base font-semibold text-charcoal-900">{result.title}</h3>
        <p className="flex-1 text-xs text-charcoal-500">
          {result.sessions} · {result.duration}
        </p>
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-peach-600">
          View details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@white/ui';

export interface AccordionItemData {
  question: string;
  answer: string;
}

export function FaqAccordion({ items, className }: { items: AccordionItemData[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn('divide-y divide-ivory-200 rounded-2xl border border-ivory-200 bg-white', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={index}>
            <h3>
              <button
                type="button"
                id={`faq-trigger-${index}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-medium text-charcoal-900 transition-colors hover:text-peach-600 sm:px-6 sm:py-5 sm:text-lg"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-charcoal-300 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    isOpen && 'rotate-180 text-peach-500',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={`faq-trigger-${index}`}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    'px-5 pb-4 text-base leading-relaxed text-charcoal-500 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 sm:pb-5',
                    isOpen ? 'translate-y-0 opacity-100 delay-100' : '-translate-y-1 opacity-0',
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button, Input, Label } from '@white/ui';

export interface FaqRow {
  question: string;
  answer: string;
}

interface FaqListEditorProps {
  label: string;
  items: FaqRow[];
  onChange: (items: FaqRow[]) => void;
}

/** Small repeatable-row editor for {question, answer}[] fields (Service.detail.faqs,
 * Package.faqs) — plain array state, no form-array library needed at this scale. */
export function FaqListEditor({ label, items, onChange }: FaqListEditorProps) {
  function update(index: number, patch: Partial<FaqRow>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...items, { question: '', answer: '' }]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" size="sm" variant="ghost" onClick={add}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-xl border border-ivory-200 p-3">
            <div className="flex flex-1 flex-col gap-2">
              <Input
                value={item.question}
                onChange={(e) => update(i, { question: e.target.value })}
                placeholder="Question"
              />
              <Input value={item.answer} onChange={(e) => update(i, { answer: e.target.value })} placeholder="Answer" />
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-charcoal-400">No FAQs added yet.</p>}
      </div>
    </div>
  );
}

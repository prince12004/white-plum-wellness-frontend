'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button, Input, Label } from '@white/ui';

export interface ProcessRow {
  title: string;
  description: string;
}

interface ProcessListEditorProps {
  items: ProcessRow[];
  onChange: (items: ProcessRow[]) => void;
}

export function ProcessListEditor({ items, onChange }: ProcessListEditorProps) {
  function update(index: number, patch: Partial<ProcessRow>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...items, { title: '', description: '' }]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>Process steps</Label>
        <Button type="button" size="sm" variant="ghost" onClick={add}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add step
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-xl border border-ivory-200 p-3">
            <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach-100 text-xs font-semibold text-peach-700">
              {i + 1}
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <Input value={item.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Step title" />
              <Input
                value={item.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Step description"
              />
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-charcoal-400">No process steps added yet.</p>}
      </div>
    </div>
  );
}

'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { HeroSlide } from '@white/types';
import { Button, ImageUpload, Input, Label, Textarea } from '@white/ui';

interface HeroSlidesEditorProps {
  slides: HeroSlide[];
  onChange: (slides: HeroSlide[]) => void;
}

const EMPTY_SLIDE: HeroSlide = { eyebrow: '', title: '', description: '', image: '' };

export function HeroSlidesEditor({ slides, onChange }: HeroSlidesEditorProps) {
  function update(index: number, patch: Partial<HeroSlide>) {
    onChange(slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  }

  function remove(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...slides, EMPTY_SLIDE]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Hero slides</Label>
        <Button type="button" size="sm" variant="ghost" onClick={add}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add slide
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {slides.map((slide, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl border border-ivory-200 p-4">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-peach-100 text-xs font-semibold text-peach-700">
                {i + 1}
              </span>
              <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Background image</Label>
              <ImageUpload value={slide.image} onChange={(url) => update(i, { image: url })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Eyebrow</Label>
              <Input
                value={slide.eyebrow}
                onChange={(e) => update(i, { eyebrow: e.target.value })}
                placeholder="Skin · Hair · Laser · Dermatology"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Title</Label>
              <Input
                value={slide.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Expert Care for Skin That Feels Like You, Only Better"
              />
              <p className="text-[11px] text-charcoal-400">The last word is highlighted in gold automatically.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={slide.description}
                onChange={(e) => update(i, { description: e.target.value })}
              />
            </div>
          </div>
        ))}
        {slides.length === 0 && <p className="text-xs text-charcoal-400">No slides yet — add at least one.</p>}
      </div>
    </div>
  );
}

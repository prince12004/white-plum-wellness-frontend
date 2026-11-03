'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button, ImageUpload, Input, Label, MultiSelect, Select, Textarea } from '@white/ui';
import { CMS_ICONS } from '@/lib/cms/icons';
import type { CmsField } from '@/lib/cms/sections';

export type SlugOptions = Record<'services' | 'packages' | 'offers', { value: string; label: string }[]>;

function emptyValue(field: CmsField): unknown {
  if (field.kind === 'list' || field.kind === 'tags' || field.kind === 'slugs') return [];
  if (field.kind === 'number') return 0;
  if (field.kind === 'icon') return 'Sparkles';
  if (field.kind === 'select') return field.options[0];
  return '';
}

function emptyItem(fields: CmsField[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((field) => [field.key, emptyValue(field)]));
}

function ListField({
  field,
  value,
  onChange,
  slugOptions,
}: {
  field: Extract<CmsField, { kind: 'list' }>;
  value: Record<string, unknown>[];
  onChange: (value: Record<string, unknown>[]) => void;
  slugOptions: SlugOptions;
}) {
  function move(index: number, by: number) {
    const next = [...value];
    const [item] = next.splice(index, 1);
    if (item) next.splice(index + by, 0, item);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>{field.label}</Label>
        <Button type="button" size="sm" variant="ghost" onClick={() => onChange([...value, emptyItem(field.fields)])}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add
        </Button>
      </div>
      {field.hint && <p className="text-[11px] text-charcoal-400">{field.hint}</p>}
      {value.map((item, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-ivory-200 p-4">
          <div className="flex items-center justify-between">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-peach-100 text-xs font-semibold text-peach-700">
              {i + 1}
            </span>
            <div className="flex gap-1">
              <Button type="button" size="sm" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" size="sm" variant="ghost" aria-label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label="Remove"
                className="text-red-600 hover:text-red-700"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SectionFields
            fields={field.fields}
            value={item}
            onChange={(next) => onChange(value.map((existing, j) => (j === i ? next : existing)))}
            slugOptions={slugOptions}
          />
        </div>
      ))}
      {value.length === 0 && <p className="text-xs text-charcoal-400">Nothing added yet.</p>}
    </div>
  );
}

/** The edit form for a section, generated from its field definitions in lib/cms/sections.ts. */
export function SectionFields({
  fields,
  value,
  onChange,
  slugOptions,
}: {
  fields: CmsField[];
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  slugOptions: SlugOptions;
}) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        const set = (next: unknown) => onChange({ ...value, [field.key]: next });
        const current = value[field.key];

        if (field.kind === 'list') {
          return (
            <ListField
              key={field.key}
              field={field}
              value={(current as Record<string, unknown>[]) ?? []}
              onChange={set}
              slugOptions={slugOptions}
            />
          );
        }

        return (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label>{field.label}</Label>
            {field.kind === 'text' && <Input value={(current as string) ?? ''} onChange={(e) => set(e.target.value)} />}
            {field.kind === 'url' && (
              <Input value={(current as string) ?? ''} onChange={(e) => set(e.target.value)} placeholder="/services or https://…" />
            )}
            {field.kind === 'number' && (
              <Input type="number" value={(current as number) ?? 0} onChange={(e) => set(Number(e.target.value))} />
            )}
            {field.kind === 'textarea' && <Textarea rows={3} value={(current as string) ?? ''} onChange={(e) => set(e.target.value)} />}
            {field.kind === 'richtext' && <Textarea rows={10} value={(current as string) ?? ''} onChange={(e) => set(e.target.value)} />}
            {field.kind === 'image' && <ImageUpload value={(current as string) ?? ''} onChange={set} />}
            {field.kind === 'tags' && (
              <Input
                defaultValue={((current as string[]) ?? []).join(', ')}
                onBlur={(e) => set(e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))}
              />
            )}
            {field.kind === 'icon' && (
              <Select value={(current as string) ?? ''} onChange={(e) => set(e.target.value)}>
                {Object.keys(CMS_ICONS).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            )}
            {field.kind === 'select' && (
              <Select value={(current as string) ?? ''} onChange={(e) => set(e.target.value)}>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
            {field.kind === 'slugs' && (
              <MultiSelect
                options={slugOptions[field.source]}
                value={(current as string[]) ?? []}
                onChange={set}
                placeholder="Select…"
              />
            )}
            {field.hint && <p className="text-[11px] text-charcoal-400">{field.hint}</p>}
          </div>
        );
      })}
    </div>
  );
}

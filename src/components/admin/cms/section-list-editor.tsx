'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, GripVertical, Plus, Trash2 } from 'lucide-react';
import type { CmsSection, Offer, PaginatedResponse, Service, TreatmentPackage } from '@white/types';
import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Switch,
} from '@white/ui';
import { apiClient } from '@/lib/admin/api-client';
import {
  createSection,
  isSectionType,
  SECTION_DEFINITIONS,
  sectionContent,
  type SectionDefinition,
  type SectionType,
} from '@/lib/cms/sections';
import { SectionFields, type SlugOptions } from './section-fields';

const GROUPS: SectionDefinition['group'][] = ['Content blocks', 'Website sections', 'Landing page sections'];

function sectionTitle(section: CmsSection): string {
  if (section.label) return section.label;
  return isSectionType(section.type) ? SECTION_DEFINITIONS[section.type].label : section.type;
}

/** Add, edit, reorder (drag or arrows), show/hide and delete a page's sections.
 * Edits stay local until the parent screen saves. */
export function SectionListEditor({ sections, onChange }: { sections: CmsSection[]; onChange: (sections: CmsSection[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CmsSection | null>(null);
  const [slugOptions, setSlugOptions] = useState<SlugOptions>({ services: [], packages: [], offers: [] });

  useEffect(() => {
    Promise.all([
      apiClient.get<PaginatedResponse<Service>>('/services?pageSize=100'),
      apiClient.get<PaginatedResponse<TreatmentPackage>>('/packages?pageSize=100'),
      apiClient.get<PaginatedResponse<Offer>>('/offers?pageSize=100'),
    ]).then(([services, packages, offers]) => {
      setSlugOptions({
        services: services.items.map((s) => ({ value: s.slug, label: s.name })),
        packages: packages.items.map((p) => ({ value: p.slug, label: p.name })),
        offers: offers.items.map((o) => ({ value: o.slug, label: o.title })),
      });
    });
  }, []);

  function update(id: string, patch: Partial<CmsSection>) {
    onChange(sections.map((section) => (section.id === id ? { ...section, ...patch } : section)));
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= sections.length || from === to) return;
    const next = [...sections];
    const [section] = next.splice(from, 1);
    if (section) next.splice(to, 0, section);
    onChange(next);
  }

  function add(type: SectionType) {
    const section = createSection(type);
    onChange([...sections, section]);
    setExpandedId(section.id);
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => {
        const definition = isSectionType(section.type) ? SECTION_DEFINITIONS[section.type] : null;
        const expanded = expandedId === section.id;
        return (
          <div
            key={section.id}
            onDragOver={(e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              setDropIndex(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) move(dragIndex, i);
              setDragIndex(null);
              setDropIndex(null);
            }}
            className={cn(
              'rounded-xl border bg-white transition-colors',
              dropIndex === i && dragIndex !== i ? 'border-peach-500' : 'border-ivory-200',
              dragIndex === i && 'opacity-50',
            )}
          >
            {/* Only this header row is draggable — a draggable ancestor would stop text selection in the form fields below. */}
            <div
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnd={() => {
                setDragIndex(null);
                setDropIndex(null);
              }}
              className="flex flex-wrap items-center gap-3 p-3"
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-charcoal-300" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-medium', section.isActive ? 'text-charcoal-900' : 'text-charcoal-400')}>
                  {sectionTitle(section)}
                </p>
                {definition && section.label && <p className="truncate text-xs text-charcoal-400">{definition.label}</p>}
              </div>
              {section.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Inactive</Badge>}
              <Switch
                aria-label={`Show ${sectionTitle(section)} on the website`}
                checked={section.isActive}
                onCheckedChange={(isActive) => update(section.id, { isActive })}
              />
              <div className="flex items-center gap-1">
                <Button type="button" size="sm" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-label="Move down"
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, i + 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setExpandedId(expanded ? null : section.id)}>
                  Edit
                  <ChevronDown className={cn('ml-1 h-4 w-4 transition-transform', expanded && 'rotate-180')} />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-label={`Delete ${sectionTitle(section)}`}
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setDeleteTarget(section)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {expanded && (
              <div className="flex flex-col gap-4 border-t border-ivory-200 p-4">
                {definition && isSectionType(section.type) ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <Label>Name in this list (not shown on the website)</Label>
                      <Input
                        value={section.label ?? ''}
                        placeholder={definition.label}
                        onChange={(e) => update(section.id, { label: e.target.value || undefined })}
                      />
                    </div>
                    {definition.dataNote && (
                      <p className="rounded-lg bg-ivory-100 px-3 py-2 text-xs text-charcoal-500">{definition.dataNote}</p>
                    )}
                    <SectionFields
                      fields={definition.fields}
                      value={sectionContent(section.type, section.content) as Record<string, unknown>}
                      onChange={(content) => update(section.id, { content })}
                      slugOptions={slugOptions}
                    />
                  </>
                ) : (
                  <p className="text-sm text-charcoal-500">This section type is no longer supported and won&apos;t appear on the website.</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {sections.length === 0 && <p className="text-sm text-charcoal-500">No sections yet. Add your first one.</p>}

      <div>
        <Button type="button" variant="secondary" onClick={() => setAdding(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add section
        </Button>
      </div>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a section</DialogTitle>
          </DialogHeader>
          {GROUPS.map((group) => (
            <div key={group} className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">{group}</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(SECTION_DEFINITIONS) as SectionType[])
                  .filter((type) => SECTION_DEFINITIONS[type].group === group)
                  .map((type) => (
                    <Button key={type} type="button" variant="ghost" className="justify-start" onClick={() => add(type)}>
                      {SECTION_DEFINITIONS[type].label}
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget && sectionTitle(deleteTarget)}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-charcoal-500">
            Its content will be lost once you save. To hide it temporarily, switch it to Inactive instead.
          </p>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onChange(sections.filter((section) => section.id !== deleteTarget?.id));
                setDeleteTarget(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

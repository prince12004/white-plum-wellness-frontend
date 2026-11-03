'use client';

import { useEffect, useState } from 'react';
import type { CmsSection, HomepageContent } from '@white/types';
import { Button, useToast } from '@white/ui';
import { SectionListEditor } from '@/components/admin/cms/section-list-editor';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { resolveHomepageSections } from '@/lib/cms/sections';

export default function HomepageManagementPage() {
  const { toast } = useToast();
  const [sections, setSections] = useState<CmsSection[] | null>(null);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiClient.get<HomepageContent>('/homepage-cms').then((home) => setSections(resolveHomepageSections(home)));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function publish() {
    setSubmitting(true);
    try {
      await apiClient.patch('/homepage-cms', { sections });
      setDirty(false);
      toast({ title: 'Homepage published — live on the website within a minute' });
    } catch (err) {
      toast({
        title: 'Could not publish',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!sections) {
    return <p className="text-sm text-charcoal-500">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">Homepage Management</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Drag sections to reorder them, switch them Active or Inactive, and edit their content. Nothing changes on the
          website until you publish.
        </p>
      </div>

      <SectionListEditor
        sections={sections}
        onChange={(next) => {
          setSections(next);
          setDirty(true);
        }}
      />

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        {dirty && <span className="text-sm text-charcoal-500">Unpublished changes</span>}
        <Button type="button" disabled={submitting || !dirty} onClick={publish}>
          {submitting ? 'Publishing…' : 'Publish changes'}
        </Button>
      </div>
    </div>
  );
}

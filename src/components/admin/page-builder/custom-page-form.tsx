'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CmsSection, CustomPage, CustomPageLayout } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ImageUpload,
  Input,
  Label,
  Select,
  Switch,
  Textarea,
  useToast,
} from '@white/ui';
import { SectionListEditor } from '@/components/admin/cms/section-list-editor';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { resolvePageSections } from '@/lib/cms/sections';

interface CustomPageFormProps {
  page?: CustomPage | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CustomPageForm({ page }: CustomPageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(page);

  const [title, setTitle] = useState(page?.title ?? '');
  const [slug, setSlug] = useState(page?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [layout, setLayout] = useState<CustomPageLayout>(page?.layout ?? 'site');
  const [sections, setSections] = useState<CmsSection[]>(page ? resolvePageSections(page) : []);
  const [metaTitle, setMetaTitle] = useState(page?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(page?.metaDescription ?? '');
  const [metaKeywords, setMetaKeywords] = useState(page?.metaKeywords ?? '');
  const [ogImage, setOgImage] = useState(page?.ogImage ?? '');
  const [canonicalUrl, setCanonicalUrl] = useState(page?.canonicalUrl ?? '');
  const [noIndex, setNoIndex] = useState(page?.noIndex ?? false);
  const [isPublished, setIsPublished] = useState(page?.isPublished ?? false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      title,
      slug,
      layout,
      sections,
      // Any legacy body text now lives in `sections` — cleared so it can't come back if those are removed.
      body: '',
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      metaKeywords: metaKeywords || null,
      ogImage: ogImage || null,
      canonicalUrl: canonicalUrl || null,
      noIndex,
      isPublished,
    };
    try {
      if (isEdit && page) {
        await apiClient.patch(`/custom-pages/${page.id}`, payload);
      } else {
        await apiClient.post('/custom-pages', payload);
      }
      toast({ title: isEdit ? 'Page updated' : 'Page created' });
      router.push('/admin/page-builder');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Page details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cp-title">Title</Label>
              <Input
                id="cp-title"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cp-slug">URL slug</Label>
              <Input
                id="cp-slug"
                required
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
              />
              <p className="text-[11px] text-charcoal-400">
                {isEdit ? 'Changing this breaks existing links and ad campaigns pointing at the old URL.' : `The page will live at /${slug}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-layout">Layout</Label>
            <Select id="cp-layout" value={layout} onChange={(e) => setLayout(e.target.value as CustomPageLayout)}>
              <option value="site">Standard page — with the website menu</option>
              <option value="landing">Landing page — no menu, for ad campaigns</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="cp-published" checked={isPublished} onCheckedChange={setIsPublished} />
            <Label htmlFor="cp-published">Published</Label>
          </div>
          {page?.systemKey && (
            <p className="text-xs text-charcoal-500">This page is required by the website, so it can be unpublished but not deleted.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Drag sections to reorder them, and switch them Active or Inactive.</CardDescription>
        </CardHeader>
        <CardContent>
          <SectionListEditor sections={sections} onChange={setSections} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-meta-title">Meta title</Label>
            <Input id="cp-meta-title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-meta-desc">Meta description</Label>
            <Textarea id="cp-meta-desc" rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-meta-keywords">Meta keywords</Label>
            <Input id="cp-meta-keywords" placeholder="Comma separated" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Social share image</Label>
            <ImageUpload value={ogImage} onChange={setOgImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-canonical">Canonical URL</Label>
            <Input id="cp-canonical" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="cp-noindex" checked={noIndex} onCheckedChange={setNoIndex} />
            <Label htmlFor="cp-noindex">Hide from search engines</Label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/page-builder')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create page'}
        </Button>
      </div>
    </form>
  );
}

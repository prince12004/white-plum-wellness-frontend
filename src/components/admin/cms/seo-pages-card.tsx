'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CustomPage, HomepageContent, PaginatedResponse } from '@white/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ImageUpload,
  Input,
  Label,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { isFixedRoutePage } from '@/lib/cms/sections';

interface SeoRow {
  /** null = the homepage, which is a singleton and has no slug. */
  pageId: string | null;
  systemKey: string | null;
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
}

/** SEO for the homepage and every CMS page, in one place. */
export function SeoPagesCard() {
  const { toast } = useToast();
  const [rows, setRows] = useState<SeoRow[] | null>(null);
  const [editing, setEditing] = useState<SeoRow | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [home, pages] = await Promise.all([
      apiClient.get<HomepageContent>('/homepage-cms'),
      apiClient.get<PaginatedResponse<CustomPage>>('/custom-pages/admin?pageSize=100'),
    ]);
    setRows([
      {
        pageId: null,
        systemKey: null,
        name: 'Homepage',
        slug: '',
        metaTitle: home.metaTitle ?? '',
        metaDescription: home.metaDescription ?? '',
        metaKeywords: home.metaKeywords ?? '',
        ogImage: home.ogImage ?? '',
        canonicalUrl: home.canonicalUrl ?? '',
        noIndex: home.noIndex ?? false,
      },
      ...pages.items.map((page) => ({
        pageId: page.id,
        systemKey: page.systemKey,
        name: page.title,
        slug: page.slug,
        metaTitle: page.metaTitle ?? '',
        metaDescription: page.metaDescription ?? '',
        metaKeywords: page.metaKeywords ?? '',
        ogImage: page.ogImage ?? '',
        canonicalUrl: page.canonicalUrl ?? '',
        noIndex: page.noIndex ?? false,
      })),
    ]);
  }, []);

  useEffect(() => {
    load().catch(() => setRows([]));
  }, [load]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const seo = {
      metaTitle: editing.metaTitle || null,
      metaDescription: editing.metaDescription || null,
      metaKeywords: editing.metaKeywords || null,
      ogImage: editing.ogImage || null,
      canonicalUrl: editing.canonicalUrl || null,
      noIndex: editing.noIndex,
    };
    try {
      if (editing.pageId) {
        await apiClient.patch(`/custom-pages/${editing.pageId}`, {
          ...seo,
          slug: editing.slug,
        });
      } else {
        await apiClient.patch('/homepage-cms', seo);
      }
      toast({ title: `SEO saved for ${editing.name}` });
      setEditing(null);
      await load();
    } catch (err) {
      toast({
        title: 'Could not save',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page SEO</CardTitle>
        <CardDescription>Search titles, descriptions, keywords and URLs for the homepage and every managed page.</CardDescription>
      </CardHeader>
      <CardContent>
        {!rows ? (
          <p className="text-sm text-charcoal-500">Loading…</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Meta title</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.pageId ?? 'home'}>
                  <TableCell className="font-medium text-charcoal-900">
                    {row.name} {row.noIndex && <Badge variant="warning">Hidden from search</Badge>}
                  </TableCell>
                  <TableCell className="text-charcoal-500">/{row.slug}</TableCell>
                  <TableCell className="text-charcoal-500">{row.metaTitle || 'Using default'}</TableCell>
                  <TableCell className="text-right">
                    <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(row)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SEO — {editing?.name}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="flex flex-col gap-4">
              {editing.pageId && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="seo-row-slug">URL slug</Label>
                  <Input id="seo-row-slug" disabled={isFixedRoutePage(editing.systemKey)} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                  <p className="text-[11px] text-charcoal-400">Changing this breaks existing links and ad campaigns pointing at the old URL.</p>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seo-row-title">Meta title</Label>
                <Input id="seo-row-title" value={editing.metaTitle} onChange={(e) => setEditing({ ...editing, metaTitle: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seo-row-description">Meta description</Label>
                <Textarea
                  id="seo-row-description"
                  rows={3}
                  value={editing.metaDescription}
                  onChange={(e) => setEditing({ ...editing, metaDescription: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seo-row-keywords">Meta keywords</Label>
                <Input
                  id="seo-row-keywords"
                  value={editing.metaKeywords}
                  placeholder="Comma separated"
                  onChange={(e) => setEditing({ ...editing, metaKeywords: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Social share image</Label>
                <ImageUpload value={editing.ogImage} onChange={(ogImage) => setEditing({ ...editing, ogImage })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seo-row-canonical">Canonical URL</Label>
                <Input
                  id="seo-row-canonical"
                  value={editing.canonicalUrl}
                  onChange={(e) => setEditing({ ...editing, canonicalUrl: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="seo-row-noindex" checked={editing.noIndex} onCheckedChange={(noIndex) => setEditing({ ...editing, noIndex })} />
                <Label htmlFor="seo-row-noindex">Hide from search engines</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" disabled={saving} onClick={save}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

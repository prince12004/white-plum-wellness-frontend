'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Upload } from 'lucide-react';
import type { MediaAsset, PaginatedResponse } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const [assets, setAssets] = useState<PaginatedResponse<MediaAsset> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAssets(await apiClient.get<PaginatedResponse<MediaAsset>>('/media/assets?pageSize=100'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body: formData, credentials: 'include' });
      if (!res.ok) throw new Error('Upload failed');
      toast({ title: 'Image uploaded' });
      load();
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }

  function openEdit(asset: MediaAsset) {
    setEditing(asset);
    setName(asset.name);
    setTitle(asset.title ?? '');
    setAltText(asset.altText ?? '');
    setCategory(asset.category ?? '');
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await apiClient.patch(`/media/assets/${editing.id}`, { name, title, altText, category });
      toast({ title: 'Image details saved' });
      setEditing(null);
      load();
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

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/media/assets/${deleteTarget.id}`);
      toast({ title: `${deleteTarget.name} deleted` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete — it may still be in use on a page',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Media Library</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Every image uploaded anywhere in the admin — all stored on Cloudinary. Add a name, alt text and category
            to keep things organised and reusable.
          </p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-peach-500 to-peach-600 px-4 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(229,102,144,0.65)] transition-all hover:-translate-y-0.5 aria-disabled:pointer-events-none aria-disabled:opacity-50">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading…' : 'Upload image'}
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-charcoal-500">Loading…</p>
      ) : assets && assets.items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.items.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="relative h-32 w-full bg-ivory-100">
                <Image src={asset.url} alt={asset.altText ?? asset.name} fill unoptimized className="object-cover" />
              </div>
              <CardContent className="flex flex-col gap-2 p-3">
                <p className="truncate text-xs font-medium text-charcoal-900">{asset.name}</p>
                <p className="truncate text-[11px] text-charcoal-400">{asset.category || 'Uncategorised'}</p>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" className="flex-1" onClick={() => openEdit(asset)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 text-red-600 hover:text-red-700" onClick={() => setDeleteTarget(asset)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-charcoal-400">
            No images uploaded yet — upload one above, or any image uploaded from a content form will show up here
            automatically.
          </CardContent>
        </Card>
      )}

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit image details</DialogTitle>
          </DialogHeader>
          {editing && (
            <form className="flex flex-col gap-4" onSubmit={handleSaveEdit}>
              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-ivory-100">
                <Image src={editing.url} alt="" fill unoptimized className="object-cover" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="asset-name">Name</Label>
                <Input id="asset-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="asset-title">Title</Label>
                <Input id="asset-title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="asset-alt">Alt text</Label>
                <Input id="asset-alt" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describes the image for accessibility & SEO" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="asset-category">Category</Label>
                <Input id="asset-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Services, Doctors, Blog" />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-charcoal-500">
            This removes it from Cloudinary too. If it&apos;s still used on a page, that image will break — check
            first.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

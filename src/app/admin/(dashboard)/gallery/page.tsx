'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { GalleryItem, PaginatedResponse } from '@white/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

export default function GalleryPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<PaginatedResponse<GalleryItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await apiClient.get<PaginatedResponse<GalleryItem>>('/gallery?pageSize=60'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/gallery/${deleteTarget.id}`);
      toast({ title: 'Gallery item deleted' });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete item',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Gallery</h1>
          <p className="mt-1 text-sm text-charcoal-500">Photos shown on the public gallery page.</p>
        </div>
        <Link href="/admin/gallery/new">
          <Button>Add image</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All images</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items?.items.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-xl border border-ivory-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.caption} className="aspect-square w-full object-cover" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
                    <Badge variant="default">{item.category}</Badge>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-charcoal-900/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link href={`/admin/gallery/${item.id}/edit`}>
                      <Button size="sm" variant="ghost" className="bg-white/90 text-charcoal-900 hover:bg-white">
                        Edit
                      </Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(item)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this image?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-charcoal-500">This can&apos;t be undone.</p>
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

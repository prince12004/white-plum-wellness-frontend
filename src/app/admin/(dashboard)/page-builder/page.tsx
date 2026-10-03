'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { CustomPage, PaginatedResponse } from '@white/types';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

export default function PageBuilderPage() {
  const { toast } = useToast();
  const [pages, setPages] = useState<PaginatedResponse<CustomPage> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CustomPage | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPages(await apiClient.get<PaginatedResponse<CustomPage>>('/custom-pages/admin?pageSize=50'));
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
      await apiClient.delete(`/custom-pages/${deleteTarget.id}`);
      toast({ title: `${deleteTarget.title} deleted` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete page',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Custom Pages</h1>
          <p className="mt-1 text-sm text-charcoal-500">Standalone content pages shown on the public site.</p>
        </div>
        <Link href="/admin/page-builder/new">
          <Button>New page</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All pages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : pages && pages.items.length === 0 ? (
            <p className="text-sm text-charcoal-500">No pages yet. Create your first one.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages?.items.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium text-charcoal-900">{page.title}</TableCell>
                    <TableCell className="text-charcoal-500">/{page.slug}</TableCell>
                    <TableCell>
                      {page.isPublished ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}
                    </TableCell>
                    <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/page-builder/${page.slug}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(page)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.title}?</DialogTitle>
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

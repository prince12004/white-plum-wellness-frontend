'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Category, PaginatedResponse } from '@white/types';
import {
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

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<PaginatedResponse<Category> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<Category>>('/categories?pageSize=50');
      setCategories(data);
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
      await apiClient.delete(`/categories/${deleteTarget.id}`);
      toast({ title: `${deleteTarget.name} deleted` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete category',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Categories</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Treatment categories shown on the homepage and services pages (Skin, Hair, Laser, etc.).
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>New category</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Short description</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.items.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="text-charcoal-500">{category.order}</TableCell>
                    <TableCell className="font-medium text-charcoal-900">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="max-w-md truncate">{category.shortDescription}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/categories/${category.slug}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(category)}>
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
            <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-charcoal-500">
            This can&apos;t be undone. Services/packages/clinics still referencing this category&apos;s slug will keep
            that slug as plain text — delete carefully.
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

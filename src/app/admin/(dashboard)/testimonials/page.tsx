'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { PaginatedResponse, Testimonial } from '@white/types';
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

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<PaginatedResponse<Testimonial> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTestimonials(await apiClient.get<PaginatedResponse<Testimonial>>('/testimonials?pageSize=50'));
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
      await apiClient.delete(`/testimonials/${deleteTarget.id}`);
      toast({ title: 'Testimonial deleted' });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete testimonial',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Testimonials</h1>
          <p className="mt-1 text-sm text-charcoal-500">Patient reviews shown across the public site.</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button>New testimonial</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials?.items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-charcoal-900">{t.name}</TableCell>
                    <TableCell>{t.treatment}</TableCell>
                    <TableCell>{t.rating} / 5</TableCell>
                    <TableCell>{t.featured && <Badge variant="peach">Featured</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/testimonials/${t.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(t)}>
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
            <DialogTitle>Delete this testimonial?</DialogTitle>
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

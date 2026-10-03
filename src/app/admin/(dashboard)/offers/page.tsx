'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Offer, PaginatedResponse } from '@white/types';
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

export default function OffersPage() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<PaginatedResponse<Offer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOffers(await apiClient.get<PaginatedResponse<Offer>>('/offers?pageSize=50'));
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
      await apiClient.delete(`/offers/${deleteTarget.id}`);
      toast({ title: `${deleteTarget.title} deleted` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete offer',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Offers</h1>
          <p className="mt-1 text-sm text-charcoal-500">Limited-time offers shown on the public site.</p>
        </div>
        <Link href="/admin/offers/new">
          <Button>New offer</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All offers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Valid until</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers?.items.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium text-charcoal-900">{offer.title}</TableCell>
                    <TableCell>{offer.offerType || '—'}</TableCell>
                    <TableCell>
                      {offer.offerPrice != null ? `₹${offer.offerPrice.toLocaleString('en-IN')}` : '—'}
                    </TableCell>
                    <TableCell>{offer.validUntil}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/offers/${offer.slug}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(offer)}>
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

'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Faq } from '@white/types';
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

export default function FaqsPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setFaqs(await apiClient.get<Faq[]>('/faqs'));
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
      await apiClient.delete(`/faqs/${deleteTarget.id}`);
      toast({ title: 'FAQ deleted' });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete FAQ',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">FAQs</h1>
          <p className="mt-1 text-sm text-charcoal-500">Homepage frequently asked questions.</p>
        </div>
        <Link href="/admin/faqs/new">
          <Button>New FAQ</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="max-w-lg font-medium text-charcoal-900">{faq.question}</TableCell>
                    <TableCell>{faq.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/faqs/${faq.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(faq)}>
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
            <DialogTitle>Delete this FAQ?</DialogTitle>
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

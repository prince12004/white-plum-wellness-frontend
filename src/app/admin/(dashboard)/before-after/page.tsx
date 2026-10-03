'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { BeforeAfterResult, PaginatedResponse } from '@white/types';
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

export default function BeforeAfterPage() {
  const { toast } = useToast();
  const [results, setResults] = useState<PaginatedResponse<BeforeAfterResult> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<BeforeAfterResult | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setResults(await apiClient.get<PaginatedResponse<BeforeAfterResult>>('/before-after?pageSize=50'));
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
      await apiClient.delete(`/before-after/${deleteTarget.id}`);
      toast({ title: `${deleteTarget.title} deleted` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete result',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Before &amp; After</h1>
          <p className="mt-1 text-sm text-charcoal-500">Real patient results shown on the public site.</p>
        </div>
        <Link href="/admin/before-after/new">
          <Button>New result</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All results</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.items.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium text-charcoal-900">{result.title}</TableCell>
                    <TableCell>{result.category}</TableCell>
                    <TableCell>{result.sessions || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/before-after/${result.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(result)}>
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

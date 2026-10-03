'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Campaign, CampaignStatus, PaginatedResponse } from '@white/types';
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

const STATUS_VARIANT: Record<CampaignStatus, 'default' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'default',
  ACTIVE: 'success',
  PAUSED: 'warning',
  COMPLETED: 'default',
};

const CHANNEL_LABEL: Record<Campaign['channel'], string> = {
  WHATSAPP: 'WhatsApp',
  SMS: 'SMS',
  EMAIL: 'Email',
  SOCIAL: 'Social',
  OTHER: 'Other',
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CampaignsPage() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<PaginatedResponse<Campaign> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCampaigns(await apiClient.get<PaginatedResponse<Campaign>>('/campaigns?pageSize=50'));
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
      await apiClient.delete(`/campaigns/${deleteTarget.id}`);
      toast({ title: 'Campaign deleted' });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete campaign',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Campaigns</h1>
          <p className="mt-1 text-sm text-charcoal-500">Track marketing campaigns, their channel, status and budget.</p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button>New campaign</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : campaigns && campaigns.items.length === 0 ? (
            <p className="text-sm text-charcoal-500">No campaigns yet. Create your first one to start tracking.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns?.items.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium text-charcoal-900">{campaign.name}</TableCell>
                    <TableCell>{CHANNEL_LABEL[campaign.channel]}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[campaign.status]}>{campaign.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                    <TableCell>{formatDate(campaign.endDate)}</TableCell>
                    <TableCell>{campaign.budget > 0 ? `₹${campaign.budget.toLocaleString('en-IN')}` : '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/campaigns/${campaign.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(campaign)}>
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

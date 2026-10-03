'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Campaign, CampaignChannel, CampaignStatus } from '@white/types';
import { Button, Card, CardContent, Input, Label, Select, Textarea, useToast } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

interface CampaignFormProps {
  campaign?: Campaign | null;
}

const CHANNEL_OPTIONS: { value: CampaignChannel; label: string }[] = [
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'SMS', label: 'SMS' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'OTHER', label: 'Other' },
];

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'COMPLETED', label: 'Completed' },
];

function toDateInputValue(value: string | null | undefined) {
  if (!value) return '';
  return value.slice(0, 10);
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(campaign);

  const [name, setName] = useState(campaign?.name ?? '');
  const [channel, setChannel] = useState<CampaignChannel>(campaign?.channel ?? 'WHATSAPP');
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status ?? 'DRAFT');
  const [startDate, setStartDate] = useState(toDateInputValue(campaign?.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(campaign?.endDate));
  const [targetAudience, setTargetAudience] = useState(campaign?.targetAudience ?? '');
  const [notes, setNotes] = useState(campaign?.notes ?? '');
  const [budget, setBudget] = useState(campaign?.budget ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      name,
      channel,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      targetAudience: targetAudience || null,
      notes: notes || null,
      budget,
    };
    try {
      if (isEdit && campaign) {
        await apiClient.patch(`/campaigns/${campaign.id}`, payload);
      } else {
        await apiClient.post('/campaigns', payload);
      }
      toast({ title: isEdit ? 'Campaign updated' : 'Campaign created' });
      router.push('/admin/campaigns');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="c-name">Campaign name</Label>
            <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-channel">Channel</Label>
              <Select id="c-channel" value={channel} onChange={(e) => setChannel(e.target.value as CampaignChannel)}>
                {CHANNEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-status">Status</Label>
              <Select id="c-status" value={status} onChange={(e) => setStatus(e.target.value as CampaignStatus)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-start">Start date</Label>
              <Input id="c-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-end">End date</Label>
              <Input id="c-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="c-budget">Budget (₹)</Label>
            <Input id="c-budget" type="number" min={0} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="c-audience">Target audience</Label>
            <Textarea
              id="c-audience"
              rows={2}
              placeholder="e.g. Past customers who booked a skin consultation in the last 6 months"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="c-notes">Notes</Label>
            <Textarea id="c-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/campaigns')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create campaign'}
        </Button>
      </div>
    </form>
  );
}

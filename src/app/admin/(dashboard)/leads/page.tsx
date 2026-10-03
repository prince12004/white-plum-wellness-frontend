'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import type { Booking, BookingStatus, PaginatedResponse } from '@white/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

function contextLabel(booking: Booking) {
  return booking.service || booking.package || booking.offer || booking.concern || 'General enquiry';
}

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<PaginatedResponse<Booking> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLeads(await apiClient.get<PaginatedResponse<Booking>>('/bookings?status=PENDING&pageSize=100'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(booking: Booking, status: BookingStatus) {
    try {
      await apiClient.patch(`/bookings/${booking.id}/status`, { status });
      toast({ title: status === 'CONFIRMED' ? 'Lead confirmed' : 'Lead cancelled' });
      load();
    } catch (err) {
      toast({
        title: 'Could not update lead',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  // A lead is only actionable if we actually have a phone number to follow up on.
  // WhatsApp-button clicks from anonymous visitors create a Booking record too (so the
  // engagement isn't lost), but with no contact info there's nothing to call — those are
  // shown separately below as a volume signal, not mixed into the follow-up queue.
  const contactableLeads = leads?.items.filter((lead) => lead.phone) ?? [];
  const anonymousClicks = leads?.items.filter((lead) => !lead.phone && lead.source === 'WHATSAPP_CLICK') ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Leads</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            New enquiries waiting on a follow-up call. Confirm or cancel to move them into Bookings history.
          </p>
        </div>
        <Badge variant="warning">{contactableLeads.length} awaiting follow-up</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New leads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : contactableLeads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Interested in</TableHead>
                  <TableHead>Clinic / city</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactableLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-charcoal-900">{lead.name || 'Unnamed'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{lead.phone}</span>
                        <a
                          href={`https://wa.me/${(lead.phone ?? '').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-whatsapp hover:text-whatsapp-dark"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                        <a href={`tel:${lead.phone}`} className="text-charcoal-400 hover:text-charcoal-700" title="Call">
                          <Phone className="h-4 w-4" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{contextLabel(lead)}</TableCell>
                    <TableCell>{lead.clinic || lead.city || '—'}</TableCell>
                    <TableCell className="text-xs text-charcoal-500">{new Date(lead.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleStatusChange(lead, 'CONFIRMED')}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleStatusChange(lead, 'CANCELLED')}>
                          Dismiss
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-6 text-center text-sm text-charcoal-400">No new leads right now — all caught up.</p>
          )}
        </CardContent>
      </Card>

      {anonymousClicks.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>WhatsApp clicks (no contact info)</CardTitle>
            <Badge variant="default">{anonymousClicks.length}</Badge>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-charcoal-500">
              Visitors who opened a WhatsApp chat without being logged in or submitting a form — no phone number to
              follow up with, shown here as an engagement signal only.
            </p>
            <div className="flex flex-col divide-y divide-ivory-200">
              {anonymousClicks.slice(0, 10).map((click) => (
                <div key={click.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-charcoal-700">{contextLabel(click)}</span>
                  <span className="text-xs text-charcoal-400">{new Date(click.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

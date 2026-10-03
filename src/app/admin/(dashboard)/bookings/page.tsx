'use client';

import { useCallback, useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { Booking, BookingStatus, PaginatedResponse } from '@white/types';
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
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

const STATUS_VARIANT: Record<BookingStatus, 'default' | 'success' | 'warning' | 'destructive'> = {
  PENDING: 'warning',
  CONFIRMED: 'default',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
};

const STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const DETAIL_FIELDS: { key: keyof Booking; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'service', label: 'Service' },
  { key: 'package', label: 'Package' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'clinic', label: 'Clinic' },
  { key: 'city', label: 'City' },
  { key: 'offer', label: 'Offer' },
  { key: 'concern', label: 'Concern' },
];

export default function BookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<PaginatedResponse<Booking> | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await apiClient.get<PaginatedResponse<Booking>>('/bookings?pageSize=50'));
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
      toast({ title: 'Booking status updated' });
      load();
    } catch (err) {
      toast({
        title: 'Could not update status',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/bookings/${deleteTarget.id}`);
      toast({ title: 'Booking deleted' });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete booking',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  function contextLabel(booking: Booking) {
    return booking.service || booking.package || booking.offer || booking.concern || '—';
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">Bookings</h1>
        <p className="mt-1 text-sm text-charcoal-500">Appointment enquiries from the public site and WhatsApp.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Interested in</TableHead>
                  <TableHead>Concern</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.items.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium text-charcoal-900">{booking.name || 'Unnamed'}</TableCell>
                    <TableCell>{booking.phone || '—'}</TableCell>
                    <TableCell>{contextLabel(booking)}</TableCell>
                    <TableCell>{booking.concern || '—'}</TableCell>
                    <TableCell>{booking.clinic || '—'}</TableCell>
                    <TableCell>
                      {booking.source === 'WHATSAPP_CLICK' ? (
                        <Badge variant="default" className="gap-1 bg-whatsapp/10 text-whatsapp-dark">
                          WhatsApp
                        </Badge>
                      ) : (
                        <Badge variant="default">Form</Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-charcoal-500">
                      {new Date(booking.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking, e.target.value as BookingStatus)}
                        className="h-8 w-36 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setViewing(booking)} title="View full details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteTarget(booking)}
                          title="Delete booking"
                        >
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewing?.name || 'Booking details'}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="flex flex-col gap-3">
              {DETAIL_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-4 border-b border-ivory-100 pb-2 text-sm">
                  <span className="text-charcoal-500">{label}</span>
                  <span className="font-medium text-charcoal-900">{(viewing[key] as string) || '—'}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-b border-ivory-100 pb-2 text-sm">
                <span className="text-charcoal-500">Source</span>
                <span className="font-medium text-charcoal-900">
                  {viewing.source === 'WHATSAPP_CLICK' ? 'WhatsApp click' : 'Website form'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-ivory-100 pb-2 text-sm">
                <span className="text-charcoal-500">Status</span>
                <Badge variant={STATUS_VARIANT[viewing.status]}>{viewing.status}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-charcoal-500">Received</span>
                <span className="font-medium text-charcoal-900">{new Date(viewing.createdAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this booking?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-charcoal-500">
            {deleteTarget?.name || 'This enquiry'} will be permanently removed. This can&apos;t be undone.
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

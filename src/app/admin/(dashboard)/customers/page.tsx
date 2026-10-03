'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Booking, Customer, Favourite, PaginatedResponse } from '@white/types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@white/ui';
import { apiClient } from '@/lib/admin/api-client';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<PaginatedResponse<Customer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [viewingBookings, setViewingBookings] = useState<Booking[]>([]);
  const [viewingFavourites, setViewingFavourites] = useState<Favourite[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCustomers(await apiClient.get<PaginatedResponse<Customer>>('/customers?pageSize=50'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleView(customer: Customer) {
    setViewing(customer);
    const [bookingsRes, favourites] = await Promise.all([
      apiClient.get<PaginatedResponse<Booking>>(`/bookings?customerId=${customer.id}&pageSize=20`),
      apiClient.get<Favourite[]>(`/favourites/customer/${customer.id}`),
    ]);
    setViewingBookings(bookingsRes.items);
    setViewingFavourites(favourites);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">Customers</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Patients who signed in with their mobile number on the public site.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All customers</CardTitle>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers?.items.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium text-charcoal-900">{customer.name ?? 'Unnamed'}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'ACTIVE' ? 'success' : 'destructive'}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>{customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : 'Never'}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleView(customer)}>
                        View
                      </Button>
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
            <DialogTitle>{viewing?.name ?? viewing?.phone}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-charcoal-500">Phone: {viewing?.phone}</p>
            <div>
              <p className="mb-1 font-medium text-charcoal-900">Bookings</p>
              {viewingBookings.length === 0 ? (
                <p className="text-charcoal-400">No bookings yet.</p>
              ) : (
                viewingBookings.map((b) => <p key={b.id}>{b.service || b.package || 'Booking'}</p>)
              )}
            </div>
            <div>
              <p className="mb-1 font-medium text-charcoal-900">Saved items</p>
              {viewingFavourites.length === 0 ? (
                <p className="text-charcoal-400">Nothing saved yet.</p>
              ) : (
                viewingFavourites.map((f) => <p key={f.id}>{f.itemSlug}</p>)
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

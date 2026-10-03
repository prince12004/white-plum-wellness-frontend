import Link from 'next/link';
import { CalendarCheck, CheckCircle2, Clock, Users } from 'lucide-react';
import type { Booking, Customer, PaginatedResponse } from '@white/types';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@white/ui';
import { getSession, serverFetch } from '@/lib/admin/auth';
import { StatCardsGrid } from '@/components/admin/dashboard/stat-cards-grid';

const STATUS_VARIANT: Record<Booking['status'], 'default' | 'success' | 'warning' | 'destructive'> = {
  PENDING: 'warning',
  CONFIRMED: 'default',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
};

export default async function DashboardPage() {
  const session = await getSession();

  const [allBookings, pendingBookings, confirmedBookings, customers, recentBookings] = await Promise.all([
    serverFetch<PaginatedResponse<Booking>>('/bookings?pageSize=1'),
    serverFetch<PaginatedResponse<Booking>>('/bookings?status=PENDING&pageSize=1'),
    serverFetch<PaginatedResponse<Booking>>('/bookings?status=CONFIRMED&pageSize=1'),
    serverFetch<PaginatedResponse<Customer>>('/customers?pageSize=1'),
    serverFetch<PaginatedResponse<Booking>>('/bookings?pageSize=6'),
  ]);

  const statCards = [
    {
      label: 'Total Bookings',
      value: allBookings?.total,
      href: '/admin/bookings',
      icon: <CalendarCheck className="h-5 w-5" />,
      iconClass: 'bg-peach-50 text-peach-600',
    },
    {
      label: 'Pending',
      value: pendingBookings?.total,
      href: '/admin/leads',
      icon: <Clock className="h-5 w-5" />,
      iconClass: 'bg-gold-50 text-gold-600',
    },
    {
      label: 'Confirmed',
      value: confirmedBookings?.total,
      href: '/admin/bookings',
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconClass: 'bg-green-50 text-green-600',
    },
    {
      label: 'Registered Customers',
      value: customers?.total,
      href: '/admin/customers',
      icon: <Users className="h-5 w-5" />,
      iconClass: 'bg-charcoal-900/5 text-charcoal-700',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">Overview</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-charcoal-900">
          Welcome back, {session?.name ?? 'there'}
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">Here&apos;s what&apos;s happening across the clinic right now.</p>
      </div>

      <StatCardsGrid stats={statCards} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent bookings</CardTitle>
          <Link href="/admin/bookings" className="text-sm font-medium text-peach-600 hover:text-peach-700">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {recentBookings && recentBookings.items.length > 0 ? (
            <div className="flex flex-col divide-y divide-ivory-200">
              {recentBookings.items.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-charcoal-900">{booking.name || 'Unnamed'}</p>
                    <p className="truncate text-xs text-charcoal-500">
                      {booking.phone || 'No phone'} · {booking.service || booking.package || booking.offer || booking.concern || 'General enquiry'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-charcoal-400">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                    <Badge variant={STATUS_VARIANT[booking.status]}>{booking.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-charcoal-400">No bookings yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

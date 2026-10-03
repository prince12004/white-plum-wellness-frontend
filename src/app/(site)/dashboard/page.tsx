import { cookies } from 'next/headers';
import { Calendar, MapPin, Stethoscope } from 'lucide-react';
import { cn } from '@white/ui';
import type { Booking, BookingStatus } from '@white/types';

const NEST_API_URL = process.env.NEST_API_URL ?? 'http://localhost:4000/api';

const STATUS_STYLE: Record<BookingStatus, string> = {
  PENDING: 'bg-gold-100 text-gold-800',
  CONFIRMED: 'bg-peach-100 text-peach-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

async function getMyBookings(): Promise<Booking[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  try {
    const res = await fetch(`${NEST_API_URL}/bookings/mine`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return (await res.json()) as Booking[];
  } catch {
    return [];
  }
}

function bookingLabel(booking: Booking): string {
  return booking.service || booking.package || booking.offer || booking.concern || 'Consultation';
}

export default async function DashboardOverviewPage() {
  const bookings = await getMyBookings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-charcoal-900">Your Bookings</h2>
        <p className="mt-1 text-sm text-charcoal-500">Every consultation or treatment you&apos;ve enquired about, in one place.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ivory-300 bg-white p-10 text-center">
          <p className="text-sm text-charcoal-500">You haven&apos;t booked anything yet.</p>
          <p className="mt-1 text-xs text-charcoal-400">Book a consultation from any treatment or package page — it will show up here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex flex-col gap-3 rounded-2xl border border-ivory-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-peach-50 text-peach-600">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold text-charcoal-900">{bookingLabel(booking)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {booking.clinic && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.clinic}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={cn('w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium', STATUS_STYLE[booking.status])}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

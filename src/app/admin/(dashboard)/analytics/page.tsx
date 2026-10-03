'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, Clock, UserPlus, Users } from 'lucide-react';
import type { AnalyticsOverview } from '@white/types';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@white/ui';
import { apiClient } from '@/lib/admin/api-client';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gold-400',
  CONFIRMED: 'bg-peach-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-charcoal-300',
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<AnalyticsOverview>('/analytics/overview').then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <p className="text-sm text-charcoal-500">Loading…</p>;
  }

  const statusEntries = Object.entries(data.statusBreakdown) as [keyof typeof data.statusBreakdown, number][];
  const maxDaily = Math.max(1, ...data.dailyTrend.map((d) => d.count));
  const maxInterest = Math.max(1, ...data.topInterests.map((t) => t.count));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">Analytics</h1>
        <p className="mt-1 text-sm text-charcoal-500">Real-time booking and customer activity across the clinic.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total bookings', value: data.totalBookings, icon: CalendarCheck, iconClass: 'bg-peach-50 text-peach-600' },
          { label: 'Total customers', value: data.totalCustomers, icon: Users, iconClass: 'bg-charcoal-900/5 text-charcoal-700' },
          { label: 'New customers (30d)', value: data.newCustomers30d, icon: UserPlus, iconClass: 'bg-green-50 text-green-600' },
          { label: 'Pending follow-ups', value: data.statusBreakdown.PENDING, icon: Clock, iconClass: 'bg-gold-50 text-gold-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-charcoal-500">{stat.label}</p>
                  <p className="font-display text-2xl font-semibold text-charcoal-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bookings — last 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            {data.dailyTrend.length > 0 ? (
              <div className="flex h-40 items-end gap-1">
                {data.dailyTrend.map((d) => (
                  <div key={d.date} className="group relative flex-1">
                    <div
                      className="rounded-t bg-gradient-to-t from-peach-500 to-peach-400 transition-all"
                      style={{ height: `${Math.max(4, (d.count / maxDaily) * 100)}%`, minHeight: 4 }}
                    />
                    <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-charcoal-900 px-2 py-1 text-[10px] text-white group-hover:block">
                      {d.date}: {d.count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-charcoal-400">No bookings in the last 30 days yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {statusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[status]}`} />
                <span className="flex-1 text-sm text-charcoal-700">{status}</span>
                <Badge variant="default">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top interests</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.topInterests.length > 0 ? (
            data.topInterests.map((interest) => (
              <div key={interest.label} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-sm text-charcoal-700">{interest.label}</span>
                <div className="h-2 flex-1 rounded-full bg-ivory-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-peach-500 to-gold-400"
                    style={{ width: `${Math.max(4, (interest.count / maxInterest) * 100)}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-medium text-charcoal-900">{interest.count}</span>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-charcoal-400">No booking data yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

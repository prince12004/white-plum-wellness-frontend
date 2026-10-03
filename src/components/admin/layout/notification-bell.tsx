'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import type { Booking, PaginatedResponse } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { hasPermission } from '@/lib/admin/permissions';
import type { Session } from '@/lib/admin/auth';

export function NotificationBell({ session }: { session: Session }) {
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const canSeeLeads = hasPermission(session, 'leads:read');

  useEffect(() => {
    if (!canSeeLeads) return;
    apiClient
      .get<PaginatedResponse<Booking>>('/bookings?status=PENDING&pageSize=1')
      .then((res) => setPendingCount(res.total))
      .catch(() => setPendingCount(null));
  }, [canSeeLeads]);

  const content = (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 bg-ivory-50 text-charcoal-600 transition-colors hover:bg-ivory-100">
      <Bell className="h-[18px] w-[18px]" />
      {!!pendingCount && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-peach-600 px-1 text-[10px] font-semibold text-white">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </div>
  );

  if (!canSeeLeads) return content;

  return (
    <Link href="/admin/leads" title={pendingCount ? `${pendingCount} new lead${pendingCount === 1 ? '' : 's'} awaiting follow-up` : 'No new leads'}>
      {content}
    </Link>
  );
}

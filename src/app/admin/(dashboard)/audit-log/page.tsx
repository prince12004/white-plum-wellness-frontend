'use client';

import { useEffect, useState } from 'react';
import type { AuditLog, PaginatedResponse } from '@white/types';
import {
  Badge,
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
} from '@white/ui';
import { apiClient } from '@/lib/admin/api-client';

const ACTION_VARIANT: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  LOGIN: 'success',
  LOGOUT: 'default',
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'destructive',
  STATUS_CHANGE: 'warning',
  PASSWORD_CHANGE: 'warning',
};

export default function AuditLogPage() {
  const [data, setData] = useState<PaginatedResponse<AuditLog> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<PaginatedResponse<AuditLog>>('/audit-log?pageSize=50')
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">Audit Log</h1>
        <p className="mt-1 text-sm text-charcoal-500">Every login and admin action, in one immutable trail.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Entity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{log.actor?.name ?? log.actorEmail}</TableCell>
                    <TableCell>
                      <Badge variant={ACTION_VARIANT[log.action] ?? 'default'}>{log.action}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{log.module}</TableCell>
                    <TableCell>{log.entityLabel ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

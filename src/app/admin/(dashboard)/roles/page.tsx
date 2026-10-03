'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Permission, Role } from '@white/types';
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
import { RoleFormDialog } from '@/components/admin/roles/role-form-dialog';

export default function RolesPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        apiClient.get<Role[]>('/roles'),
        apiClient.get<Permission[]>('/permissions'),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
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
      await apiClient.delete(`/roles/${deleteTarget.id}`);
      toast({ title: `${deleteTarget.label} deleted` });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({
        title: 'Could not delete role',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
      setDeleteTarget(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Roles &amp; Permissions</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Every module has its own permission rows — assign exactly what each role needs.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setDialogOpen(true);
          }}
        >
          New role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All roles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium text-charcoal-900">{role.label}</TableCell>
                    <TableCell className="font-mono text-xs">{role.key}</TableCell>
                    <TableCell>{role.permissions.length}</TableCell>
                    <TableCell>
                      <Badge variant={role.isSystem ? 'peach' : 'default'}>
                        {role.isSystem ? 'System' : 'Custom'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingRole(role);
                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        {!role.isSystem && (
                          <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(role)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permissions={permissions}
        role={editingRole}
        onSaved={load}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.label}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-charcoal-500">
            Users currently assigned this role will keep it until reassigned. This cannot be undone.
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

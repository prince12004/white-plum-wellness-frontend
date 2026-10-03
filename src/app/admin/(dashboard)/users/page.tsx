'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import type { PaginatedResponse, Role, User } from '@white/types';
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
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { useSession } from '@/hooks/admin/use-session';
import { UserFormDialog } from '@/components/admin/users/user-form-dialog';

const STATUS_VARIANT: Record<User['status'], 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  INACTIVE: 'warning',
  SUSPENDED: 'destructive',
};

export default function UsersPage() {
  const { toast } = useToast();
  const { session } = useSession();
  const isSuperAdmin = session?.roleKey === 'SUPER_ADMIN';

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [confirmName, setConfirmName] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<User>>('/users?pageSize=50');
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    apiClient.get<Role[]>('/roles').then(setRoles);
  }, [loadUsers]);

  async function handleSuspend() {
    if (!suspendTarget) return;
    try {
      await apiClient.delete(`/users/${suspendTarget.id}`);
      toast({ title: `${suspendTarget.name} suspended` });
      setSuspendTarget(null);
      loadUsers();
    } catch (err) {
      toast({
        title: 'Could not suspend user',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  async function handleActivate(user: User) {
    try {
      await apiClient.patch(`/users/${user.id}`, { status: 'ACTIVE' });
      toast({ title: `${user.name} activated` });
      loadUsers();
    } catch (err) {
      toast({
        title: 'Could not activate user',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    }
  }

  async function handleHardDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/users/${deleteTarget.id}/permanent`);
      toast({ title: `${deleteTarget.name} permanently deleted` });
      setDeleteTarget(null);
      setConfirmName('');
      loadUsers();
    } catch (err) {
      toast({
        title: 'Could not delete user',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Manage Admins</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Admin, clinic, and content team accounts. {isSuperAdmin && 'As Super Admin, you can also permanently delete accounts.'}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setDialogOpen(true);
          }}
        >
          New user
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-charcoal-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-charcoal-900">
                      <div className="flex items-center gap-1.5">
                        {user.name}
                        {user.role?.key === 'SUPER_ADMIN' && (
                          <ShieldAlert className="h-3.5 w-3.5 text-gold-600" aria-label="Super Admin" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role?.label ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[user.status]}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingUser(user);
                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        {user.status === 'SUSPENDED' ? (
                          <Button size="sm" variant="secondary" onClick={() => handleActivate(user)}>
                            Activate
                          </Button>
                        ) : (
                          <Button size="sm" variant="destructive" onClick={() => setSuspendTarget(user)}>
                            Suspend
                          </Button>
                        )}
                        {isSuperAdmin && user.id !== session?.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteTarget(user)}
                            title="Permanently delete"
                          >
                            <Trash2 className="h-4 w-4" />
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

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        roles={roles}
        user={editingUser}
        onSaved={loadUsers}
      />

      <Dialog open={Boolean(suspendTarget)} onOpenChange={(open) => !open && setSuspendTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {suspendTarget?.name}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-charcoal-500">
            They will no longer be able to sign in. This can be reversed any time with Activate.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSuspendTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setConfirmName('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently delete {deleteTarget?.name}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-red-600">
            This cannot be undone — their account, access, and login history are removed entirely. Suspend instead
            if you just want to revoke access reversibly.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-name">
              Type <span className="font-semibold text-charcoal-900">{deleteTarget?.name}</span> to confirm
            </Label>
            <Input id="confirm-name" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} autoComplete="off" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmName !== deleteTarget?.name || deleting}
              onClick={handleHardDelete}
            >
              {deleting ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

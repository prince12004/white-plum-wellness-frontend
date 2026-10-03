'use client';

import { useEffect, useState } from 'react';
import type { Permission, Role } from '@white/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { PermissionMatrix } from './permission-matrix';

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
  role?: Role | null;
  onSaved: () => void;
}

export function RoleFormDialog({ open, onOpenChange, permissions, role, onSaved }: RoleFormDialogProps) {
  const { toast } = useToast();
  const isEdit = Boolean(role);

  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setKey(role?.key ?? '');
      setLabel(role?.label ?? '');
      setDescription(role?.description ?? '');
      setSelected(new Set(role?.permissions.map((p) => p.id) ?? []));
      setError(null);
    }
  }, [open, role]);

  function toggle(permissionId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const permissionIds = Array.from(selected);
      if (isEdit && role) {
        await apiClient.patch(`/roles/${role.id}`, { label, description, permissionIds });
      } else {
        await apiClient.post('/roles', { key, label, description, permissionIds });
      }
      toast({ title: isEdit ? 'Role updated' : 'Role created' });
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${role?.label}` : 'New role'}</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                required
                disabled={isEdit}
                placeholder="FRONT_DESK"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                required
                disabled={role?.isSystem}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              disabled={role?.isSystem}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Permissions</Label>
            <PermissionMatrix permissions={permissions} selected={selected} onToggle={toggle} />
            {role?.isSystem && (
              <p className="text-xs text-charcoal-300">
                This is a system role — its name is fixed, but you can still change what it can do below.
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

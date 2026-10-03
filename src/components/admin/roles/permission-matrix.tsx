'use client';

import type { Permission } from '@white/types';

interface PermissionMatrixProps {
  permissions: Permission[];
  selected: Set<string>;
  onToggle: (permissionId: string) => void;
  disabled?: boolean;
}

export function PermissionMatrix({ permissions, selected, onToggle, disabled }: PermissionMatrixProps) {
  const byModule = new Map<string, Permission[]>();
  for (const permission of permissions) {
    const list = byModule.get(permission.module) ?? [];
    list.push(permission);
    byModule.set(permission.module, list);
  }

  return (
    <div className="max-h-80 overflow-y-auto rounded-xl border border-ivory-200">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-ivory-100">
          {Array.from(byModule.entries()).map(([module, modulePermissions]) => (
            <tr key={module} className="align-top">
              <td className="w-40 px-4 py-3 font-medium capitalize text-charcoal-700">
                {module.replace(/-/g, ' ')}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-3">
                  {modulePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center gap-1.5 text-charcoal-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-ivory-200 text-peach-500 focus:ring-peach-400"
                        checked={selected.has(permission.id)}
                        disabled={disabled}
                        onChange={() => onToggle(permission.id)}
                      />
                      {permission.action}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

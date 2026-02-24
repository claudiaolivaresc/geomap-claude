'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { LayerPermissions, PermissionLevel } from '@/types';

interface PermissionsFormProps {
  permissions: LayerPermissions;
  onChange: (permissions: LayerPermissions) => void;
}

const ROLES: { value: PermissionLevel; label: string; description: string }[] = [
  { value: 'public', label: 'Public', description: 'No login required' },
  { value: 'free', label: 'Free', description: 'Free registered users' },
  { value: 'premium', label: 'Premium', description: 'Premium subscribers' },
  { value: 'admin', label: 'Admin', description: 'Administrators' },
];

export function PermissionsForm({ permissions, onChange }: PermissionsFormProps) {
  const handleAuthChange = (checked: boolean) => {
    onChange({ ...permissions, requiresAuth: checked });
  };

  const handleRoleToggle = (role: PermissionLevel, checked: boolean) => {
    const currentRoles = permissions.allowedRoles || [];
    const newRoles = checked
      ? [...currentRoles, role]
      : currentRoles.filter((r) => r !== role);
    onChange({ ...permissions, allowedRoles: newRoles });
  };

  return (
    <div className="space-y-4">
      {/* Auth requirement */}
      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <Checkbox
          id="requires-auth"
          checked={permissions.requiresAuth}
          onCheckedChange={handleAuthChange}
        />
        <div>
          <Label htmlFor="requires-auth" className="font-medium cursor-pointer">
            Requires Authentication
          </Label>
          <p className="text-xs text-gray-500">
            Users must be logged in to see this layer
          </p>
        </div>
      </div>

      {/* Role checkboxes */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Allowed Roles
        </Label>
        <div className="space-y-2">
          {ROLES.map((role) => (
            <div key={role.value} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
              <Checkbox
                id={`role-${role.value}`}
                checked={permissions.allowedRoles?.includes(role.value) ?? false}
                onCheckedChange={(checked) => handleRoleToggle(role.value, checked as boolean)}
              />
              <div>
                <Label htmlFor={`role-${role.value}`} className="cursor-pointer">
                  {role.label}
                </Label>
                <p className="text-xs text-gray-400">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

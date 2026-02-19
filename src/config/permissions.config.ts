import type { PermissionLevel } from '@/types';

export const PERMISSION_HIERARCHY: Record<PermissionLevel, number> = {
  public: 0,
  free: 1,
  premium: 2,
  enterprise: 3,
  admin: 4,
};

export const PERMISSION_LABELS: Record<PermissionLevel, string> = {
  public: 'Public',
  free: 'Free Account',
  premium: 'Pro',
  enterprise: 'Enterprise',
  admin: 'Admin',
};

export const PERMISSION_COLORS: Record<PermissionLevel, string> = {
  public: '#10b981', // green
  free: '#3b82f6',   // blue
  premium: '#f97316', // orange
  enterprise: '#8b5cf6', // purple
  admin: '#ef4444',  // red
};

// Check if a user level can access a required level
export function canAccess(userLevel: PermissionLevel, requiredLevel: PermissionLevel): boolean {
  return PERMISSION_HIERARCHY[userLevel] >= PERMISSION_HIERARCHY[requiredLevel];
}

// Get the minimum required level from an array of allowed roles
export function getMinimumRequiredLevel(allowedRoles: PermissionLevel[]): PermissionLevel {
  if (allowedRoles.includes('public')) return 'public';

  let minLevel: PermissionLevel = 'admin';
  let minHierarchy = PERMISSION_HIERARCHY.admin;

  for (const role of allowedRoles) {
    if (PERMISSION_HIERARCHY[role] < minHierarchy) {
      minLevel = role;
      minHierarchy = PERMISSION_HIERARCHY[role];
    }
  }

  return minLevel;
}

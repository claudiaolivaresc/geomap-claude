import type { UserRole, LayerPermissions, User } from '@/types';

export const ROLE_LABELS: Record<UserRole, string> = {
  public: 'Public',
  admin: 'Admin',
  company: 'Company User',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  public: '#10b981',
  admin: '#ef4444',
  company: '#3b82f6',
};

export function canAccessLayer(user: User | null, permissions: LayerPermissions): boolean {
  if (permissions.visibility === 'public') {
    return true;
  }

  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  if (user.role === 'company' && user.companyId) {
    return permissions.allowedCompanies.includes(user.companyId);
  }

  return false;
}

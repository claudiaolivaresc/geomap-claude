import type { PermissionLevel } from './layer.types';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  subscriptionLevel: PermissionLevel;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

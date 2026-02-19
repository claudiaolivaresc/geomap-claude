import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, PermissionLevel, LayerPermissions } from '@/types';
import { canAccess, getMinimumRequiredLevel } from '@/config';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  hasPermission: (permissions: LayerPermissions) => boolean;
  getUserLevel: () => PermissionLevel;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: true,
      isAuthenticated: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      hasPermission: (permissions) => {
        const { user } = get();

        // Public layers are always accessible
        if (!permissions.requiresAuth) {
          return true;
        }

        // If auth required but no user, deny
        if (!user) {
          return false;
        }

        // Check if user's level is in allowed roles
        const requiredLevel = getMinimumRequiredLevel(permissions.allowedRoles);
        return canAccess(user.subscriptionLevel, requiredLevel);
      },

      getUserLevel: () => {
        const { user } = get();
        return user?.subscriptionLevel ?? 'public';
      },
    }),
    {
      name: 'geomap-auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

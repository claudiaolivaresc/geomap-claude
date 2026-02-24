import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, LayerPermissions } from '@/types';
import { canAccessLayer } from '@/config';

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
  getUserRole: () => UserRole;
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
        return canAccessLayer(user, permissions);
      },

      getUserRole: () => {
        const { user } = get();
        return user?.role ?? 'public';
      },
    }),
    {
      name: 'geomap-auth-store',
      version: 2,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          const user = state.user as Record<string, unknown> | null;
          if (user && 'subscriptionLevel' in user) {
            const oldLevel = user.subscriptionLevel as string;
            if (oldLevel === 'admin') {
              user.role = 'admin';
            } else {
              state.user = null;
              state.isAuthenticated = false;
            }
            delete user.subscriptionLevel;
          }
        }
        return state;
      },
    }
  )
);

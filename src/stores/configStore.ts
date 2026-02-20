import { create } from 'zustand';

interface AdminOverrideEntry {
  style_overrides: Record<string, unknown>;
  visible_fields: string[];
  metadata_overrides: { title?: string; description?: string; citation?: string };
}

interface ConfigState {
  overrides: Map<string, AdminOverrideEntry>;
  isLoaded: boolean;
}

interface ConfigActions {
  fetchOverrides: () => Promise<void>;
  getOverride: (layerId: string) => AdminOverrideEntry | undefined;
}

export const useConfigStore = create<ConfigState & ConfigActions>()((set, get) => ({
  overrides: new Map(),
  isLoaded: false,

  fetchOverrides: async () => {
    try {
      const res = await fetch('/api/layers/overrides');
      if (res.ok) {
        const data = await res.json();
        const map = new Map<string, AdminOverrideEntry>();
        for (const [id, entry] of Object.entries(data.overrides)) {
          map.set(id, entry as AdminOverrideEntry);
        }
        set({ overrides: map, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  getOverride: (layerId) => get().overrides.get(layerId),
}));

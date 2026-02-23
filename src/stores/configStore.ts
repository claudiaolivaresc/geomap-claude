import { create } from 'zustand';

interface AdminOverrideEntry {
  style_overrides: Record<string, unknown>;
  visible_fields: string[];
  metadata_overrides: { title?: string; description?: string; citation?: string };
  published: boolean;
  is_dynamic?: boolean;
  layer_type?: string;
  schema_name?: string;
  table_name?: string;
  vector_style_type?: string;
  group_id?: string;
  source_config?: Record<string, unknown>;
}

interface ConfigState {
  overrides: Map<string, AdminOverrideEntry>;
  isLoaded: boolean;
}

interface ConfigActions {
  fetchOverrides: () => Promise<void>;
  getOverride: (layerId: string) => AdminOverrideEntry | undefined;
  isLayerPublished: (layerId: string) => boolean;
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

  isLayerPublished: (layerId) => {
    const override = get().overrides.get(layerId);
    return override?.published !== false;
  },
}));

import { create } from 'zustand';
import { TILESERVER_URLS } from '@/config/map.config';
import type { LayerConfig, LayerLegend, LayerPermissions, VectorStyleType } from '@/types';
import type { FieldEntry } from '@/types/admin.types';

export interface AdminOverrideEntry {
  style_overrides: Record<string, unknown>;
  visible_fields: FieldEntry[];
  metadata_overrides: { title?: string; description?: string; citation?: string };
  published: boolean;
  is_dynamic?: boolean;
  layer_type?: string;
  schema_name?: string;
  table_name?: string;
  vector_style_type?: string;
  group_id?: string;
  source_config?: Record<string, unknown>;
  title?: string;
  legend_config?: LayerLegend;
  permissions_config?: LayerPermissions;
  default_opacity?: number;
}

export interface CustomGroup {
  id: string;
  title: string;
  parent_id: string | null;
  color: string;
  display_order?: number;
}

interface ConfigState {
  overrides: Map<string, AdminOverrideEntry>;
  customGroups: CustomGroup[];
  isLoaded: boolean;
}

interface ConfigActions {
  fetchOverrides: () => Promise<void>;
  getOverride: (layerId: string) => AdminOverrideEntry | undefined;
  isLayerPublished: (layerId: string) => boolean;
  getDynamicLayers: () => LayerConfig[];
  getCustomGroups: () => CustomGroup[];
}

// ── Helpers for building dynamic LayerConfig from DB entries ──

function getDefaultVectorPaint(
  styleType: string | undefined,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    circle: {
      'circle-radius': 4,
      'circle-color': '#3388ff',
      'circle-opacity': 0.8,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#000000',
    },
    line: {
      'line-color': '#3388ff',
      'line-width': 2,
      'line-opacity': 0.8,
    },
    fill: {
      'fill-color': '#3388ff',
      'fill-opacity': 0.5,
      'fill-outline-color': '#000000',
    },
  };
  return { ...(defaults[styleType || 'circle'] || defaults.circle), ...overrides };
}

function generateDefaultLegend(entry: AdminOverrideEntry): LayerLegend {
  const paint = entry.style_overrides || {};
  const color = (paint['circle-color'] || paint['line-color'] || paint['fill-color'] || '#3388ff') as string;
  // Only use simple string colors for auto-generated legend; data-driven expressions aren't renderable
  const safeColor = typeof color === 'string' ? color : '#3388ff';
  return {
    type: 'symbol',
    items: [{ color: safeColor, label: entry.title || entry.table_name || 'Layer' }],
  };
}

function buildDynamicLayerConfig(id: string, entry: AdminOverrideEntry): LayerConfig {
  const isRaster = entry.layer_type === 'raster';
  const schema = entry.schema_name!;
  const table = entry.table_name!;
  const sourceLayer = `${schema}.${table}`;

  const source = isRaster
    ? {
        type: 'raster' as const,
        tiles: [`${TILESERVER_URLS.raster}/tiles/${schema}.${table}/{z}/{x}/{y}.png`],
        tileSize: (entry.source_config?.tileSize as number) || 256,
        ...(entry.source_config?.minzoom != null && { minzoom: entry.source_config.minzoom as number }),
        ...(entry.source_config?.maxzoom != null && { maxzoom: entry.source_config.maxzoom as number }),
      }
    : {
        type: 'vector' as const,
        tiles: [`${TILESERVER_URLS.vector}/${schema}.${table}/{z}/{x}/{y}.pbf`],
        ...(entry.source_config?.minzoom != null && { minzoom: entry.source_config.minzoom as number }),
        ...(entry.source_config?.maxzoom != null && { maxzoom: entry.source_config.maxzoom as number }),
      };

  const style = isRaster
    ? {
        paint: {
          'raster-opacity': entry.default_opacity ?? 0.8,
          'raster-resampling': 'nearest' as const,
          ...(entry.style_overrides || {}),
        },
      }
    : {
        type: (entry.vector_style_type || 'circle') as VectorStyleType,
        sourceLayer,
        paint: getDefaultVectorPaint(entry.vector_style_type, entry.style_overrides),
      };

  // Determine legend: use stored config if available, else auto-generate
  const legend: LayerLegend | undefined =
    entry.legend_config && ('type' in entry.legend_config)
      ? entry.legend_config
      : generateDefaultLegend(entry);

  return {
    id,
    type: (entry.layer_type as 'raster' | 'vector') || 'vector',
    title: entry.title || entry.metadata_overrides?.title || table,
    source,
    style,
    legend,
    metadata: {
      description: entry.metadata_overrides?.description || '',
      citation: entry.metadata_overrides?.citation || '',
    },
    permissions: entry.permissions_config || {
      visibility: 'public',
      allowedCompanies: [],
    },
    defaultOpacity: entry.default_opacity ?? 1,
    schema,
    table,
  };
}

// ── Store ──

export const useConfigStore = create<ConfigState & ConfigActions>()((set, get) => ({
  overrides: new Map(),
  customGroups: [],
  isLoaded: false,

  fetchOverrides: async () => {
    try {
      const [overridesRes, groupsRes] = await Promise.all([
        fetch('/api/layers/overrides'),
        fetch('/api/admin/groups').catch(() => null),
      ]);

      const map = new Map<string, AdminOverrideEntry>();
      if (overridesRes.ok) {
        const data = await overridesRes.json();
        for (const [id, entry] of Object.entries(data.overrides)) {
          map.set(id, entry as AdminOverrideEntry);
        }
      }

      let customGroups: CustomGroup[] = [];
      if (groupsRes?.ok) {
        const gData = await groupsRes.json();
        customGroups = gData.groups || [];
      }

      set({ overrides: map, customGroups, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  getOverride: (layerId) => get().overrides.get(layerId),

  isLayerPublished: (layerId) => {
    const override = get().overrides.get(layerId);
    return override?.published !== false;
  },

  getDynamicLayers: () => {
    const configs: LayerConfig[] = [];
    for (const [id, entry] of get().overrides.entries()) {
      if (!entry.is_dynamic || !entry.schema_name || !entry.table_name) continue;
      if (entry.published === false) continue;
      configs.push(buildDynamicLayerConfig(id, entry));
    }
    return configs;
  },

  getCustomGroups: () => get().customGroups,
}));

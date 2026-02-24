import { getLayerById as getStaticLayerById, getAllLayers } from '@/config';
import { useConfigStore } from '@/stores/configStore';
import type { LayerConfig } from '@/types';

/**
 * Look up a layer by ID — checks static config first, then dynamic layers from DB.
 * For static layers, applies legend/permissions overrides from admin config if present.
 */
export function getAnyLayerById(id: string): LayerConfig | undefined {
  const staticLayer = getStaticLayerById(id);
  if (staticLayer) {
    const override = useConfigStore.getState().getOverride(id);
    if (override?.legend_config || override?.permissions_config) {
      return {
        ...staticLayer,
        ...(override.legend_config ? { legend: override.legend_config } : {}),
        ...(override.permissions_config ? { permissions: override.permissions_config } : {}),
      };
    }
    return staticLayer;
  }
  return useConfigStore.getState().getDynamicLayers().find((l) => l.id === id);
}

/**
 * Get all layers — both static config and dynamic from DB.
 */
export function getAllLayersIncludingDynamic(): LayerConfig[] {
  return [...getAllLayers(), ...useConfigStore.getState().getDynamicLayers()];
}

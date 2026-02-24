import { getLayerById as getStaticLayerById, getAllLayers } from '@/config';
import { useConfigStore } from '@/stores/configStore';
import type { LayerConfig } from '@/types';

/**
 * Look up a layer by ID — checks static config first, then dynamic layers from DB.
 */
export function getAnyLayerById(id: string): LayerConfig | undefined {
  return getStaticLayerById(id) ||
    useConfigStore.getState().getDynamicLayers().find((l) => l.id === id);
}

/**
 * Get all layers — both static config and dynamic from DB.
 */
export function getAllLayersIncludingDynamic(): LayerConfig[] {
  return [...getAllLayers(), ...useConfigStore.getState().getDynamicLayers()];
}

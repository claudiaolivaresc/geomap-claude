import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Map as MapboxMap } from 'mapbox-gl';
import type { ActiveLayer, LayerConfig, VectorStyle } from '@/types';
import { getAnyLayerById } from '@/lib/layerLookup';
import { COLOR_RAMPS, buildRasterColorExpression } from '@/config/layers.config';
import type { RasterClassification } from '@/types';
import { useConfigStore } from './configStore';

/** GIS stacking order: points on top (0), rasters at bottom (3) */
function getLayerTypeRank(layerId: string): number {
  const config = getAnyLayerById(layerId);
  if (!config) return 3;
  if (config.type === 'raster') return 3;
  const vectorType = (config.style as VectorStyle)?.type;
  if (vectorType === 'circle') return 0;
  if (vectorType === 'line') return 1;
  if (vectorType === 'fill') return 2;
  return 3;
}

/** Insert a new layer into the Map at the correct position by type rank */
function insertLayerSorted(
  activeLayers: Map<string, ActiveLayer>,
  layerId: string,
  entry: ActiveLayer,
): Map<string, ActiveLayer> {
  const newRank = getLayerTypeRank(layerId);
  const entries = Array.from(activeLayers.entries());

  // Find insertion point: before the first entry with a strictly higher rank
  let insertIdx = entries.length;
  for (let i = 0; i < entries.length; i++) {
    if (getLayerTypeRank(entries[i][0]) > newRank) {
      insertIdx = i;
      break;
    }
  }

  entries.splice(insertIdx, 0, [layerId, entry]);
  return new Map(entries);
}

interface LayerState {
  activeLayers: Map<string, ActiveLayer>;
  expandedGroups: Set<string>;
}

interface LayerActions {
  toggleLayer: (layerId: string) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  toggleGroupExpanded: (groupId: string) => void;
  setGroupExpanded: (groupId: string, expanded: boolean) => void;
  addLayerToMap: (map: MapboxMap, layerConfig: LayerConfig) => void;
  removeLayerFromMap: (map: MapboxMap, layerId: string) => void;
  updateLayerOnMap: (map: MapboxMap, layerId: string) => void;
  reorderLayers: (orderedIds: string[]) => void;
  isLayerActive: (layerId: string) => boolean;
  getLayerState: (layerId: string) => ActiveLayer | undefined;
}

type LayerStore = LayerState & LayerActions;

export const useLayerStore = create<LayerStore>()(
  persist(
    (set, get) => ({
      // State
      activeLayers: new Map(),
      expandedGroups: new Set(['global', 'surface-module', 'subsurface']),

      // Actions
      toggleLayer: (layerId) => {
        const { activeLayers } = get();

        if (activeLayers.has(layerId)) {
          // Toggle visibility of existing layer
          const newActiveLayers = new Map(activeLayers);
          const layer = newActiveLayers.get(layerId)!;
          newActiveLayers.set(layerId, { ...layer, visible: !layer.visible });
          set({ activeLayers: newActiveLayers });
        } else {
          // Insert new layer at the correct position by type rank
          const config = getAnyLayerById(layerId);
          const entry: ActiveLayer = {
            id: layerId,
            visible: true,
            opacity: config?.defaultOpacity ?? 1,
          };
          set({ activeLayers: insertLayerSorted(activeLayers, layerId, entry) });
        }
      },

      setLayerVisibility: (layerId, visible) => {
        const { activeLayers } = get();

        if (activeLayers.has(layerId)) {
          const newActiveLayers = new Map(activeLayers);
          const layer = newActiveLayers.get(layerId)!;
          newActiveLayers.set(layerId, { ...layer, visible });
          set({ activeLayers: newActiveLayers });
        } else if (visible) {
          // Insert new layer at the correct position by type rank
          const config = getAnyLayerById(layerId);
          const entry: ActiveLayer = {
            id: layerId,
            visible: true,
            opacity: config?.defaultOpacity ?? 1,
          };
          set({ activeLayers: insertLayerSorted(activeLayers, layerId, entry) });
        }
      },

      setLayerOpacity: (layerId, opacity) => {
        const { activeLayers } = get();
        const newActiveLayers = new Map(activeLayers);

        if (newActiveLayers.has(layerId)) {
          const layer = newActiveLayers.get(layerId)!;
          newActiveLayers.set(layerId, { ...layer, opacity });
        }

        set({ activeLayers: newActiveLayers });
      },

      toggleGroupExpanded: (groupId) => {
        const { expandedGroups } = get();
        const newExpandedGroups = new Set(expandedGroups);

        if (newExpandedGroups.has(groupId)) {
          newExpandedGroups.delete(groupId);
        } else {
          newExpandedGroups.add(groupId);
        }

        set({ expandedGroups: newExpandedGroups });
      },

      setGroupExpanded: (groupId, expanded) => {
        const { expandedGroups } = get();
        const newExpandedGroups = new Set(expandedGroups);

        if (expanded) {
          newExpandedGroups.add(groupId);
        } else {
          newExpandedGroups.delete(groupId);
        }

        set({ expandedGroups: newExpandedGroups });
      },

      addLayerToMap: (map, layerConfig) => {
        // Guard: skip unpublished layers
        if (!useConfigStore.getState().isLayerPublished(layerConfig.id)) {
          return;
        }

        const sourceId = `source-${layerConfig.id}`;
        const layerId = `layer-${layerConfig.id}`;

        try {
          // Remove existing layer/source if they exist
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }

          // Get admin overrides from config store
          const adminOverride = useConfigStore.getState().getOverride(layerConfig.id);
          const styleOv = adminOverride?.style_overrides || {};

          // Add source
          if (layerConfig.type === 'raster') {
            map.addSource(sourceId, {
              type: 'raster',
              tiles: layerConfig.source.tiles,
              tileSize: layerConfig.source.tileSize || 256,
              ...(layerConfig.source.minzoom != null && { minzoom: layerConfig.source.minzoom }),
              ...(layerConfig.source.maxzoom != null && { maxzoom: layerConfig.source.maxzoom }),
            });

            // Build raster paint from config style (raster-color + resampling from test-tileserver)
            const rasterStyle = layerConfig.style as {
              paint: Record<string, unknown>;
            };
            const rasterPaint: Record<string, unknown> = {
              'raster-opacity': (styleOv['raster-opacity'] as number) ?? layerConfig.defaultOpacity ?? 0.8,
            };

            // Resolve color: classification → ramp key → default
            const classification = styleOv['raster_classification'] as RasterClassification | undefined;
            const rampKey = styleOv['color_ramp'] as string;
            if (classification?.entries?.length) {
              rasterPaint['raster-color'] = buildRasterColorExpression(classification);
            } else if (rampKey && COLOR_RAMPS[rampKey]) {
              rasterPaint['raster-color'] = COLOR_RAMPS[rampKey];
            } else if (rasterStyle.paint?.['raster-color']) {
              rasterPaint['raster-color'] = rasterStyle.paint['raster-color'];
            }

            rasterPaint['raster-resampling'] =
              (styleOv['raster-resampling'] as string) ??
              rasterStyle.paint?.['raster-resampling'] ??
              'nearest';

            map.addLayer({
              id: layerId,
              type: 'raster',
              source: sourceId,
              paint: rasterPaint,
            });
          } else {
            const vectorStyle = layerConfig.style as {
              type: string;
              sourceLayer?: string;
              paint: Record<string, unknown>;
            };

            map.addSource(sourceId, {
              type: 'vector',
              tiles: layerConfig.source.tiles,
              ...(layerConfig.source.minzoom !== undefined && { minzoom: layerConfig.source.minzoom }),
              ...(layerConfig.source.maxzoom !== undefined && { maxzoom: layerConfig.source.maxzoom }),
            });

            // Merge admin style overrides into vector paint
            const mergedPaint = { ...vectorStyle.paint };
            for (const [key, val] of Object.entries(styleOv)) {
              if (val !== undefined && val !== null && val !== '') {
                mergedPaint[key] = val;
              }
            }

            map.addLayer({
              id: layerId,
              type: vectorStyle.type as 'circle' | 'line' | 'fill',
              source: sourceId,
              'source-layer': vectorStyle.sourceLayer || `${layerConfig.schema}.${layerConfig.table}`,
              paint: mergedPaint,
            });
          }
        } catch (err) {
          console.error(`Failed to add layer ${layerConfig.id}:`, err);
          // Clean up partial state
          try {
            if (map.getLayer(layerId)) map.removeLayer(layerId);
            if (map.getSource(sourceId)) map.removeSource(sourceId);
          } catch { /* ignore cleanup errors */ }
        }
      },

      removeLayerFromMap: (map, layerId) => {
        const mapLayerId = `layer-${layerId}`;
        const sourceId = `source-${layerId}`;

        if (map.getLayer(mapLayerId)) {
          map.removeLayer(mapLayerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      },

      updateLayerOnMap: (map, layerId) => {
        const { activeLayers } = get();
        const layerState = activeLayers.get(layerId);
        const mapLayerId = `layer-${layerId}`;

        if (!layerState || !map.getLayer(mapLayerId)) return;

        const config = getAnyLayerById(layerId);
        if (!config) return;

        // Update visibility
        map.setLayoutProperty(
          mapLayerId,
          'visibility',
          layerState.visible ? 'visible' : 'none'
        );

        // Update opacity
        if (config.type === 'raster') {
          map.setPaintProperty(mapLayerId, 'raster-opacity', layerState.opacity);
        } else {
          const vectorStyle = config.style as { type: string };
          if (vectorStyle.type === 'circle') {
            map.setPaintProperty(mapLayerId, 'circle-opacity', layerState.opacity);
          } else if (vectorStyle.type === 'line') {
            map.setPaintProperty(mapLayerId, 'line-opacity', layerState.opacity);
          } else if (vectorStyle.type === 'fill') {
            map.setPaintProperty(mapLayerId, 'fill-opacity', layerState.opacity);
          }
        }
      },

      reorderLayers: (orderedIds) => {
        const { activeLayers } = get();
        const newActiveLayers = new Map<string, ActiveLayer>();
        for (const id of orderedIds) {
          const layer = activeLayers.get(id);
          if (layer) {
            newActiveLayers.set(id, layer);
          }
        }
        // Keep any remaining layers not in orderedIds
        activeLayers.forEach((layer, id) => {
          if (!newActiveLayers.has(id)) {
            newActiveLayers.set(id, layer);
          }
        });
        set({ activeLayers: newActiveLayers });
      },

      isLayerActive: (layerId) => {
        const { activeLayers } = get();
        const layer = activeLayers.get(layerId);
        return layer?.visible ?? false;
      },

      getLayerState: (layerId) => {
        const { activeLayers } = get();
        return activeLayers.get(layerId);
      },
    }),
    {
      name: 'geomap-layer-store',
      partialize: (state) => ({
        activeLayers: Array.from(state.activeLayers.entries()),
        expandedGroups: Array.from(state.expandedGroups),
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as {
          activeLayers?: [string, ActiveLayer][];
          expandedGroups?: string[];
        };
        return {
          ...current,
          activeLayers: new Map(persistedState.activeLayers || []),
          expandedGroups: new Set(persistedState.expandedGroups || ['global', 'surface-module', 'subsurface']),
        };
      },
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Map as MapboxMap } from 'mapbox-gl';
import type { ActiveLayer, LayerConfig } from '@/types';
import { getLayerById } from '@/config';
import { COLOR_RAMPS } from '@/config/layers.config';
import { useConfigStore } from './configStore';

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
  isLayerActive: (layerId: string) => boolean;
  getLayerState: (layerId: string) => ActiveLayer | undefined;
}

type LayerStore = LayerState & LayerActions;

export const useLayerStore = create<LayerStore>()(
  persist(
    (set, get) => ({
      // State
      activeLayers: new Map(),
      expandedGroups: new Set(['surface', 'subsurface']),

      // Actions
      toggleLayer: (layerId) => {
        const { activeLayers } = get();
        const newActiveLayers = new Map(activeLayers);

        if (newActiveLayers.has(layerId)) {
          const layer = newActiveLayers.get(layerId)!;
          newActiveLayers.set(layerId, { ...layer, visible: !layer.visible });
        } else {
          const config = getLayerById(layerId);
          newActiveLayers.set(layerId, {
            id: layerId,
            visible: true,
            opacity: config?.defaultOpacity ?? 1,
          });
        }

        set({ activeLayers: newActiveLayers });
      },

      setLayerVisibility: (layerId, visible) => {
        const { activeLayers } = get();
        const newActiveLayers = new Map(activeLayers);

        if (newActiveLayers.has(layerId)) {
          const layer = newActiveLayers.get(layerId)!;
          newActiveLayers.set(layerId, { ...layer, visible });
        } else if (visible) {
          const config = getLayerById(layerId);
          newActiveLayers.set(layerId, {
            id: layerId,
            visible: true,
            opacity: config?.defaultOpacity ?? 1,
          });
        }

        set({ activeLayers: newActiveLayers });
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
        const sourceId = `source-${layerConfig.id}`;
        const layerId = `layer-${layerConfig.id}`;

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

          // Resolve color ramp: admin override key → COLOR_RAMPS lookup, else default
          const rampKey = styleOv['color_ramp'] as string;
          if (rampKey && COLOR_RAMPS[rampKey]) {
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

        const config = getLayerById(layerId);
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
          expandedGroups: new Set(persistedState.expandedGroups || ['surface', 'subsurface']),
        };
      },
    }
  )
);

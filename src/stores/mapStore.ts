import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Map as MapboxMap } from 'mapbox-gl';
import type { Viewport } from '@/types';
import { MAP_CONFIG } from '@/config';

interface MapState {
  map: MapboxMap | null;
  viewport: Viewport;
  isLoaded: boolean;
  currentBasemap: string;
}

interface MapActions {
  setMap: (map: MapboxMap | null) => void;
  setViewport: (viewport: Partial<Viewport>) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setBasemap: (basemapId: string) => void;
  flyTo: (center: [number, number], zoom?: number) => void;
  resetView: () => void;
}

type MapStore = MapState & MapActions;

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      // State
      map: null,
      viewport: {
        center: MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom,
        bearing: 0,
        pitch: 0,
      },
      isLoaded: false,
      currentBasemap: MAP_CONFIG.defaultStyle,

      // Actions
      setMap: (map) => set({ map }),

      setViewport: (viewport) =>
        set((state) => ({
          viewport: { ...state.viewport, ...viewport },
        })),

      setIsLoaded: (isLoaded) => set({ isLoaded }),

      setBasemap: (basemapId) => {
        const { map } = get();
        const style = MAP_CONFIG.styles.find((s) => s.id === basemapId);
        if (map && style) {
          map.setStyle(style.url);
          set({ currentBasemap: basemapId });
        }
      },

      flyTo: (center, zoom) => {
        const { map, viewport } = get();
        if (map) {
          map.flyTo({
            center,
            zoom: zoom ?? viewport.zoom,
            duration: 1500,
          });
        }
      },

      resetView: () => {
        const { map } = get();
        if (map) {
          map.flyTo({
            center: MAP_CONFIG.defaultCenter as [number, number],
            zoom: MAP_CONFIG.defaultZoom,
            bearing: 0,
            pitch: 0,
            duration: 1500,
          });
        }
      },
    }),
    {
      name: 'geomap-map-store',
      partialize: (state) => ({
        viewport: state.viewport,
        currentBasemap: state.currentBasemap,
      }),
    }
  )
);

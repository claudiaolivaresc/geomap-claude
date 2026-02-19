import type { MapConfig } from '@/types';

export const TILESERVER_URLS = {
  raster: process.env.NEXT_PUBLIC_RASTER_TILESERVER_URL || 'https://tileserver-147328131785.us-central1.run.app',
  vector: process.env.NEXT_PUBLIC_VECTOR_TILESERVER_URL || 'https://vector-tileserver-147328131785.us-central1.run.app',
} as const;

export const MAP_CONFIG: MapConfig = {
  defaultCenter: [-98.5795, 39.8283], // Center of USA
  defaultZoom: 4,
  minZoom: 1,
  maxZoom: 18,
  defaultStyle: 'light',
  styles: [
    {
      id: 'light',
      name: 'Light',
      url: 'mapbox://styles/mapbox/light-v11',
      thumbnail: '/basemaps/light.png',
    },
    {
      id: 'dark',
      name: 'Dark',
      url: 'mapbox://styles/mapbox/dark-v11',
      thumbnail: '/basemaps/dark.png',
    },
    {
      id: 'satellite',
      name: 'Satellite',
      url: 'mapbox://styles/mapbox/satellite-streets-v12',
      thumbnail: '/basemaps/satellite.png',
    },
    {
      id: 'terrain',
      name: 'Terrain',
      url: 'mapbox://styles/mapbox/outdoors-v12',
      thumbnail: '/basemaps/terrain.png',
    },
  ],
};

export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

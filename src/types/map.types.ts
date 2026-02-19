import type { LngLatLike } from 'mapbox-gl';

export interface Viewport {
  center: LngLatLike;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapConfig {
  defaultCenter: LngLatLike;
  defaultZoom: number;
  minZoom?: number;
  maxZoom?: number;
  defaultStyle: string;
  styles: BasemapStyle[];
}

export interface BasemapStyle {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
}

export interface MapState {
  viewport: Viewport;
  isLoaded: boolean;
  currentBasemap: string;
}

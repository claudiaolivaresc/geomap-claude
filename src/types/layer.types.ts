import type { FillPaint, LinePaint, CirclePaint, RasterPaint } from 'mapbox-gl';

export type LayerType = 'raster' | 'vector';
export type VectorStyleType = 'fill' | 'line' | 'circle' | 'symbol';
export type PermissionLevel = 'public' | 'free' | 'premium' | 'enterprise' | 'admin';

export interface LayerSource {
  type: 'raster' | 'vector';
  tiles: string[];
  tileSize?: number;
  minzoom?: number;
  maxzoom?: number;
}

export interface RasterStyle {
  paint: {
    'raster-opacity'?: number;
    'raster-color'?: unknown[];
    'raster-resampling'?: 'linear' | 'nearest';
  };
}

export interface VectorStyle {
  type: VectorStyleType;
  paint: FillPaint | LinePaint | CirclePaint;
  sourceLayer?: string;
}

export interface LegendGradient {
  type: 'gradient';
  min: number;
  max: number;
  unit: string;
  gradient: string;
  colors?: string[];
}

export interface LegendSymbol {
  type: 'symbol';
  items: Array<{
    color: string;
    label: string;
    icon?: string;
  }>;
}

export type LayerLegend = LegendGradient | LegendSymbol;

export interface LayerMetadata {
  description: string;
  citation?: string;
  source?: string;
  updatedAt?: string;
}

export interface LayerPermissions {
  requiresAuth: boolean;
  allowedRoles: PermissionLevel[];
}

export interface LayerConfig {
  id: string;
  type: LayerType;
  title: string;
  source: LayerSource;
  style: RasterStyle | VectorStyle;
  legend?: LayerLegend;
  metadata: LayerMetadata;
  permissions: LayerPermissions;
  defaultVisible?: boolean;
  defaultOpacity?: number;
  schema?: string;
  table?: string;
}

export interface LayerGroup {
  id: string;
  title: string;
  icon?: string;
  color?: string;
  defaultExpanded?: boolean;
  layers?: LayerConfig[];
  children?: LayerGroup[];
}

export interface ActiveLayer {
  id: string;
  visible: boolean;
  opacity: number;
}

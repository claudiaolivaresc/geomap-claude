import type { LayerLegend, LayerPermissions } from './layer.types';

export interface ColorStop {
  position: number;
  color: string;
}

export interface AdminOverride {
  layer_id: string;
  style_overrides: Record<string, unknown>;
  visible_fields: string[];
  metadata_overrides: {
    title?: string;
    description?: string;
    citation?: string;
  };
  published?: boolean;
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
  display_order?: number;
  updated_at?: string;
  updated_by?: string;
}

export interface AdminLayerView {
  id: string;
  title: string;
  type: 'raster' | 'vector';
  schema?: string;
  table?: string;
  group: string;
  vectorStyleType?: 'circle' | 'line' | 'fill';
  defaultOpacity: number;
  style_overrides: Record<string, unknown>;
  visible_fields: string[];
  published: boolean;
  is_dynamic?: boolean;
  legend_config?: LayerLegend;
  permissions_config?: LayerPermissions;
  metadata: { title: string; description: string; citation?: string };
  defaults: {
    paint: Record<string, unknown>;
    opacity: number;
    metadata: { description: string; citation?: string };
  };
}

export interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
}

export interface PostGISTable {
  schema_name: string;
  table_name: string;
  geometry_type: string | null;
  has_raster: boolean;
  full_name: string;
  already_registered: boolean;
  suggested_style_type?: 'circle' | 'line' | 'fill';
}

export interface UpdateLayerConfig {
  style_overrides?: Record<string, unknown>;
  visible_fields?: string[];
  metadata_overrides?: {
    title?: string;
    description?: string;
    citation?: string;
  };
  published?: boolean;
  is_dynamic?: boolean;
  layer_type?: string;
  schema_name?: string;
  table_name?: string;
  vector_style_type?: string;
  group_id?: string;
  source_config?: Record<string, unknown>;
  title?: string;
  legend_config?: Record<string, unknown>;
  permissions_config?: Record<string, unknown>;
  default_opacity?: number;
  display_order?: number;
}

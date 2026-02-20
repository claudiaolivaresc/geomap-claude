export interface AdminOverride {
  layer_id: string;
  style_overrides: Record<string, unknown>;
  visible_fields: string[];
  metadata_overrides: {
    title?: string;
    description?: string;
    citation?: string;
  };
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

export interface UpdateLayerConfig {
  style_overrides?: Record<string, unknown>;
  visible_fields?: string[];
  metadata_overrides?: {
    title?: string;
    description?: string;
    citation?: string;
  };
}

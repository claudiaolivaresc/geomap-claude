import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ overrides: {} });
  }

  try {
    const result = await pool.query(
      `SELECT layer_id, style_overrides, visible_fields, metadata_overrides, published,
              is_dynamic, layer_type, schema_name, table_name, vector_style_type, group_id, source_config,
              title, legend_config, permissions_config, default_opacity
       FROM public.layer_admin_config`
    );

    const overrides: Record<string, {
      style_overrides: Record<string, unknown>;
      visible_fields: string[];
      metadata_overrides: Record<string, string>;
      published: boolean;
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
    }> = {};
    for (const row of result.rows) {
      overrides[row.layer_id] = {
        style_overrides: row.style_overrides || {},
        visible_fields: row.visible_fields || [],
        metadata_overrides: row.metadata_overrides || {},
        published: row.published !== false,
        is_dynamic: row.is_dynamic || false,
        layer_type: row.layer_type || undefined,
        schema_name: row.schema_name || undefined,
        table_name: row.table_name || undefined,
        vector_style_type: row.vector_style_type || undefined,
        group_id: row.group_id || undefined,
        source_config: row.source_config || undefined,
        title: row.title || undefined,
        legend_config: row.legend_config && Object.keys(row.legend_config).length > 0 ? row.legend_config : undefined,
        permissions_config: row.permissions_config || undefined,
        default_opacity: row.default_opacity ?? undefined,
      };
    }

    return NextResponse.json({ overrides });
  } catch {
    return NextResponse.json({ overrides: {} });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers } from '@/config';
import type { UpdateLayerConfig } from '@/types/admin.types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate layer exists (static layers) or allow dynamic layer creation
  const body: UpdateLayerConfig = await request.json();
  const allLayers = getAllLayers();
  const isStaticLayer = allLayers.some((l) => l.id === id);
  if (!isStaticLayer && !body.is_dynamic) {
    return NextResponse.json({ error: `Unknown layer: ${id}` }, { status: 400 });
  }

  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    await pool.query(
      `INSERT INTO public.layer_admin_config (
         layer_id, style_overrides, visible_fields, metadata_overrides, published,
         is_dynamic, layer_type, schema_name, table_name, vector_style_type, group_id, source_config, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
       ON CONFLICT (layer_id) DO UPDATE SET
         style_overrides = COALESCE($2, layer_admin_config.style_overrides),
         visible_fields = COALESCE($3, layer_admin_config.visible_fields),
         metadata_overrides = COALESCE($4, layer_admin_config.metadata_overrides),
         published = COALESCE($5, layer_admin_config.published),
         is_dynamic = COALESCE($6, layer_admin_config.is_dynamic),
         layer_type = COALESCE($7, layer_admin_config.layer_type),
         schema_name = COALESCE($8, layer_admin_config.schema_name),
         table_name = COALESCE($9, layer_admin_config.table_name),
         vector_style_type = COALESCE($10, layer_admin_config.vector_style_type),
         group_id = COALESCE($11, layer_admin_config.group_id),
         source_config = COALESCE($12, layer_admin_config.source_config),
         updated_at = NOW()`,
      [
        id,
        JSON.stringify(body.style_overrides || {}),
        JSON.stringify(body.visible_fields || []),
        JSON.stringify(body.metadata_overrides || {}),
        body.published ?? true,
        body.is_dynamic ?? false,
        body.layer_type ?? null,
        body.schema_name ?? null,
        body.table_name ?? null,
        body.vector_style_type ?? null,
        body.group_id ?? null,
        JSON.stringify(body.source_config || {}),
      ]
    );

    return NextResponse.json({ success: true, layer_id: id });
  } catch (err) {
    console.error('Failed to save layer config:', err);
    return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers } from '@/config';
import type { UpdateLayerConfig } from '@/types/admin.types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate layer exists
  const allLayers = getAllLayers();
  if (!allLayers.find((l) => l.id === id)) {
    return NextResponse.json({ error: `Unknown layer: ${id}` }, { status: 400 });
  }

  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body: UpdateLayerConfig = await request.json();

  try {
    await pool.query(
      `INSERT INTO public.layer_admin_config (layer_id, style_overrides, visible_fields, metadata_overrides, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (layer_id) DO UPDATE SET
         style_overrides = COALESCE($2, layer_admin_config.style_overrides),
         visible_fields = COALESCE($3, layer_admin_config.visible_fields),
         metadata_overrides = COALESCE($4, layer_admin_config.metadata_overrides),
         updated_at = NOW()`,
      [
        id,
        JSON.stringify(body.style_overrides || {}),
        JSON.stringify(body.visible_fields || []),
        JSON.stringify(body.metadata_overrides || {}),
      ]
    );

    return NextResponse.json({ success: true, layer_id: id });
  } catch (err) {
    console.error('Failed to save layer config:', err);
    return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
  }
}

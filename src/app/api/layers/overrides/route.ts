import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ overrides: {} });
  }

  try {
    const result = await pool.query(
      'SELECT layer_id, style_overrides, visible_fields, metadata_overrides FROM public.layer_admin_config'
    );

    const overrides: Record<string, { style_overrides: Record<string, unknown>; visible_fields: string[]; metadata_overrides: Record<string, string> }> = {};
    for (const row of result.rows) {
      overrides[row.layer_id] = {
        style_overrides: row.style_overrides || {},
        visible_fields: row.visible_fields || [],
        metadata_overrides: row.metadata_overrides || {},
      };
    }

    return NextResponse.json({ overrides });
  } catch {
    return NextResponse.json({ overrides: {} });
  }
}

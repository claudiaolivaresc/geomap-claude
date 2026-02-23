import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers } from '@/config';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;

  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  // Validate table against known layers + dynamic layers
  const allowed = new Set(
    getAllLayers()
      .filter((l) => l.schema && l.table)
      .map((l) => `${l.schema}.${l.table}`)
  );

  // Also allow dynamic layer tables from the admin config
  try {
    const dynResult = await pool.query(
      `SELECT schema_name, table_name FROM public.layer_admin_config WHERE is_dynamic = TRUE AND schema_name IS NOT NULL AND table_name IS NOT NULL`
    );
    for (const row of dynResult.rows) {
      allowed.add(`${row.schema_name}.${row.table_name}`);
    }
  } catch {
    // DB not available, continue with static only
  }

  if (!allowed.has(table)) {
    return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 });
  }

  const [schema, tableName] = table.split('.');

  try {
    const result = await pool.query(
      `SELECT column_name, data_type, (is_nullable = 'YES') as is_nullable
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2
         AND column_name NOT IN ('geom', 'geometry', 'wkb_geometry', 'ogc_fid', 'gid')
         AND udt_name NOT IN ('geometry', 'geography')
       ORDER BY ordinal_position`,
      [schema, tableName]
    );

    return NextResponse.json({
      columns: result.rows.map((r) => ({
        column_name: r.column_name,
        data_type: r.data_type,
        is_nullable: r.is_nullable,
      })),
    });
  } catch (err) {
    console.error('Failed to query columns:', err);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

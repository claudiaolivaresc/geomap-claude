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

  // Validate table against known layers, dynamic layers, and discoverable PostGIS tables
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

  // Also allow any table discoverable from geometry_columns / raster_columns (for new layer registration)
  if (!allowed.has(table)) {
    try {
      const [schema, tableName] = table.split('.');
      const geoCheck = await pool.query(
        `SELECT 1 FROM geometry_columns WHERE f_table_schema = $1 AND f_table_name = $2
         UNION ALL
         SELECT 1 FROM raster_columns WHERE r_table_schema = $1 AND r_table_name = $2
         LIMIT 1`,
        [schema, tableName]
      );
      if (geoCheck.rows.length > 0) {
        allowed.add(table);
      }
    } catch {
      // Ignore — will fall through to error below
    }
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

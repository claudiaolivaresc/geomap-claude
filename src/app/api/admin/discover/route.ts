import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers } from '@/config';
import type { PostGISTable } from '@/types/admin.types';

function inferStyleType(geometryType: string | null): 'circle' | 'line' | 'fill' | undefined {
  if (!geometryType) return undefined;
  const upper = geometryType.toUpperCase();
  if (upper.includes('POINT')) return 'circle';
  if (upper.includes('LINE')) return 'line';
  if (upper.includes('POLYGON')) return 'fill';
  return undefined;
}

export async function GET() {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    // 1. Query geometry_columns for vector tables
    const vectorResult = await pool.query(`
      SELECT f_table_schema AS schema_name,
             f_table_name AS table_name,
             type AS geometry_type
      FROM geometry_columns
      WHERE f_table_schema NOT IN ('pg_catalog', 'information_schema', 'topology')
      ORDER BY f_table_schema, f_table_name
    `);

    // 2. Query raster_columns for raster tables
    const rasterResult = await pool.query(`
      SELECT r_table_schema AS schema_name,
             r_table_name AS table_name
      FROM raster_columns
      WHERE r_table_schema NOT IN ('pg_catalog', 'information_schema', 'topology')
      ORDER BY r_table_schema, r_table_name
    `);

    // 3. Build set of already-registered tables (static config + dynamic layers in DB)
    const registeredTables = new Set(
      getAllLayers()
        .filter((l) => l.schema && l.table)
        .map((l) => `${l.schema}.${l.table}`)
    );

    const dynamicResult = await pool.query(
      `SELECT schema_name, table_name FROM public.layer_admin_config
       WHERE is_dynamic = TRUE AND schema_name IS NOT NULL AND table_name IS NOT NULL`
    );
    for (const row of dynamicResult.rows) {
      registeredTables.add(`${row.schema_name}.${row.table_name}`);
    }

    // 4. Build raster lookup set
    const rasterTables = new Set<string>();
    for (const row of rasterResult.rows) {
      rasterTables.add(`${row.schema_name}.${row.table_name}`);
    }

    // 5. Combine vector + raster, deduplicate
    const tableMap = new Map<string, PostGISTable>();

    for (const row of vectorResult.rows) {
      const fullName = `${row.schema_name}.${row.table_name}`;
      if (!tableMap.has(fullName)) {
        tableMap.set(fullName, {
          schema_name: row.schema_name,
          table_name: row.table_name,
          geometry_type: row.geometry_type,
          has_raster: rasterTables.has(fullName),
          full_name: fullName,
          already_registered: registeredTables.has(fullName),
          suggested_style_type: inferStyleType(row.geometry_type),
        });
      }
    }

    // Add raster-only tables (not already in vector results)
    for (const row of rasterResult.rows) {
      const fullName = `${row.schema_name}.${row.table_name}`;
      if (!tableMap.has(fullName)) {
        tableMap.set(fullName, {
          schema_name: row.schema_name,
          table_name: row.table_name,
          geometry_type: null,
          has_raster: true,
          full_name: fullName,
          already_registered: registeredTables.has(fullName),
        });
      }
    }

    const tables = Array.from(tableMap.values()).sort((a, b) =>
      a.full_name.localeCompare(b.full_name)
    );

    return NextResponse.json({ tables });
  } catch (err) {
    console.error('Failed to discover PostGIS tables:', err);
    return NextResponse.json({ error: 'Discovery query failed' }, { status: 500 });
  }
}

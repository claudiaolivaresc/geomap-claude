import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers } from '@/config';

// Build whitelist of allowed schema.table combinations from layer config
function getAllowedTables(): Set<string> {
  const tables = new Set<string>();
  for (const layer of getAllLayers()) {
    if (layer.type === 'raster' && layer.schema && layer.table) {
      tables.add(`${layer.schema}.${layer.table}`);
    }
  }
  return tables;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lng = parseFloat(searchParams.get('lng') || '');
  const lat = parseFloat(searchParams.get('lat') || '');
  const table = searchParams.get('table') || '';

  if (isNaN(lng) || isNaN(lat) || !table) {
    return NextResponse.json(
      { error: 'Missing or invalid parameters: lng, lat, table' },
      { status: 400 }
    );
  }

  // Validate table name against known layers (prevent SQL injection)
  const allowed = getAllowedTables();
  if (!allowed.has(table)) {
    return NextResponse.json(
      { error: `Unknown table: ${table}` },
      { status: 400 }
    );
  }

  const pool = getPool();
  if (!pool) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    // Use ST_Value to query the raw raster cell value at the given point
    const [schema, tableName] = table.split('.');
    const result = await pool.query(
      `SELECT ST_Value(rast, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as value
       FROM "${schema}"."${tableName}"
       WHERE ST_Intersects(rast, ST_SetSRID(ST_MakePoint($1, $2), 4326))
       LIMIT 1`,
      [lng, lat]
    );

    if (result.rows.length === 0 || result.rows[0].value === null) {
      return NextResponse.json({ value: null });
    }

    return NextResponse.json({ value: result.rows[0].value });
  } catch (err) {
    console.error('Raster value query error:', err);
    return NextResponse.json(
      { error: 'Database query failed' },
      { status: 500 }
    );
  }
}

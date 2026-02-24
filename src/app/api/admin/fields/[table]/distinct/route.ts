import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { getAllLayers } from '@/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  const column = request.nextUrl.searchParams.get('column');

  if (!column) {
    return NextResponse.json({ error: 'Missing column parameter' }, { status: 400 });
  }

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
    // Validate column exists in the table
    const colCheck = await pool.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2 AND column_name = $3`,
      [schema, tableName, column]
    );
    if (colCheck.rows.length === 0) {
      return NextResponse.json({ error: `Unknown column: ${column}` }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT DISTINCT "${column}" AS val
       FROM "${schema}"."${tableName}"
       WHERE "${column}" IS NOT NULL
       ORDER BY val
       LIMIT 50`,
      []
    );

    return NextResponse.json({
      values: result.rows.map((r: { val: unknown }) => String(r.val)),
    });
  } catch (err) {
    console.error('Failed to query distinct values:', err);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

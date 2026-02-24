import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'UPDATE public.companies SET name = $1 WHERE id = $2',
      [name.trim(), id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to update company:', err);
    return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    // Remove this company from all layer allowedCompanies arrays
    await pool.query(`
      UPDATE public.layer_admin_config
      SET permissions_config = jsonb_set(
        permissions_config,
        '{allowedCompanies}',
        (
          SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
          FROM jsonb_array_elements(permissions_config->'allowedCompanies') elem
          WHERE elem #>> '{}' != $1
        )
      )
      WHERE permissions_config->'allowedCompanies' @> to_jsonb($1::text)
    `, [id]);

    await pool.query('DELETE FROM public.companies WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete company:', err);
    return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  const { id } = await params;

  try {
    // Delete child groups first (set their parent_id to null)
    await pool.query('UPDATE public.layer_groups SET parent_id = NULL WHERE parent_id = $1', [id]);
    // Delete the group
    await pool.query('DELETE FROM public.layer_groups WHERE id = $1', [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete group:', err);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ groups: [] });
  }

  try {
    const result = await pool.query(
      'SELECT id, title, parent_id, color, display_order FROM public.layer_groups ORDER BY display_order, title'
    );
    return NextResponse.json({ groups: result.rows });
  } catch {
    return NextResponse.json({ groups: [] });
  }
}

export async function POST(request: Request) {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { title, parent_id, color } = body as {
      title?: string;
      parent_id?: string | null;
      color?: string;
    };

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Generate a slug ID from the title
    const baseId = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check for ID collision and append a suffix if needed
    let id = baseId;
    let suffix = 1;
    while (true) {
      const existing = await pool.query('SELECT id FROM public.layer_groups WHERE id = $1', [id]);
      if (existing.rows.length === 0) break;
      id = `${baseId}-${suffix++}`;
    }

    await pool.query(
      'INSERT INTO public.layer_groups (id, title, parent_id, color) VALUES ($1, $2, $3, $4)',
      [id, title.trim(), parent_id || null, color || '#6366f1']
    );

    return NextResponse.json({ group: { id, title: title.trim(), parent_id: parent_id || null, color: color || '#6366f1' } });
  } catch (err) {
    console.error('Failed to create group:', err);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

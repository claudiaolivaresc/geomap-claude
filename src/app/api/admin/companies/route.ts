import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ companies: [] });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, created_at FROM public.companies ORDER BY name'
    );
    return NextResponse.json({ companies: result.rows });
  } catch {
    return NextResponse.json({ companies: [] });
  }
}

export async function POST(request: NextRequest) {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }

  const id = randomUUID();

  try {
    await pool.query(
      'INSERT INTO public.companies (id, name) VALUES ($1, $2)',
      [id, name.trim()]
    );
    return NextResponse.json({ success: true, company: { id, name: name.trim() } });
  } catch (err) {
    console.error('Failed to create company:', err);
    return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
  }
}

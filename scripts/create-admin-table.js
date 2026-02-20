const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:mgq-dwc6qrz0nun0NVC@34.28.250.253:5432/geodata01',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.layer_admin_config (
        layer_id TEXT PRIMARY KEY,
        style_overrides JSONB DEFAULT '{}'::jsonb,
        visible_fields JSONB DEFAULT '[]'::jsonb,
        metadata_overrides JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        updated_by TEXT
      )
    `);
    console.log('Table layer_admin_config created successfully');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

main();

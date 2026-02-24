const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:mgq-dwc6qrz0nun0NVC@34.28.250.253:5432/geodata01',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    // Create companies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Table companies created/verified');

    // Migrate existing permissions_config from old format to new format
    const result = await pool.query(`
      UPDATE public.layer_admin_config
      SET permissions_config = jsonb_build_object(
        'visibility', 'public',
        'allowedCompanies', '[]'::jsonb
      )
      WHERE permissions_config IS NOT NULL
        AND permissions_config ? 'requiresAuth'
    `);
    console.log(`Migrated ${result.rowCount} permission configs to new format`);

    // Update default value for permissions_config column
    await pool.query(`
      ALTER TABLE public.layer_admin_config
      ALTER COLUMN permissions_config
      SET DEFAULT '{"visibility":"public","allowedCompanies":[]}'::jsonb
    `);
    console.log('Updated default value for permissions_config');

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
  }
}

main();

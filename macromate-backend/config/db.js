// macromate-backend/config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let poolConfig;

const DEFAULT_DB_URL = 'postgresql://postgres.mdlpeualjuqgltlcsyey:Vyaym@1june2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;

poolConfig = {
  connectionString,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

// Helper function to convert '?' placeholders to PostgreSQL '$1, $2...'
function convertPlaceholders(sql) {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

// Global query wrapper maintaining MySQL-compatible [rows] return structure
const query = async (sql, params = []) => {
  let pgSql = convertPlaceholders(sql);

  // Auto-append RETURNING id for INSERT queries if not present
  if (/^\s*INSERT\s+INTO/i.test(pgSql) && !/RETURNING/i.test(pgSql)) {
    pgSql += ' RETURNING id';
  }

  const result = await pool.query(pgSql, params);
  const rows = result.rows || [];

  // Emulate mysql2 insertId behavior
  if (rows.length > 0 && rows[0].id !== undefined) {
    rows.insertId = rows[0].id;
  }

  return [rows, result];
};

// Transaction connection wrapper
const getConnection = async () => {
  const client = await pool.connect();

  const clientQuery = async (sql, params = []) => {
    let pgSql = convertPlaceholders(sql);
    if (/^\s*INSERT\s+INTO/i.test(pgSql) && !/RETURNING/i.test(pgSql)) {
      pgSql += ' RETURNING id';
    }
    const result = await client.query(pgSql, params);
    const rows = result.rows || [];
    if (rows.length > 0 && rows[0].id !== undefined) {
      rows.insertId = rows[0].id;
    }
    return [rows, result];
  };

  return {
    query: clientQuery,
    beginTransaction: () => client.query('BEGIN'),
    commit: () => client.query('COMMIT'),
    rollback: () => client.query('ROLLBACK'),
    release: () => client.release(),
  };
};

module.exports = {
  pool,
  query,
  getConnection,
};

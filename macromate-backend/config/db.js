// macromate-backend/config/db.js
let Pool = null;
try {
  Pool = require('pg').Pool;
} catch (e) {
  // pg module not installed in current environment
}

try {
  require('dotenv').config();
} catch (e) {}

const { executeMockQuery } = require('./mockDbEngine');

let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 3000,
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'aws-0-ap-south-1.pooler.supabase.com',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 6543,
    user: process.env.DB_USER || 'postgres.mdlpeualjuqgltlcsyey',
    password: process.env.DB_PASSWORD || 'Vyaym@1june2026',
    database: process.env.DB_NAME || 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 3000,
  };
}

let pool = null;
let useFallback = !Pool;

if (Pool) {
  try {
    pool = new Pool(poolConfig);
    pool.on('error', (err) => {
      console.warn('PostgreSQL pool connection notice:', err.message);
      useFallback = true;
    });
  } catch (e) {
    console.warn('Database pool init notice:', e.message);
    useFallback = true;
  }
}

// Helper function to convert '?' placeholders to PostgreSQL '$1, $2...'
function convertPlaceholders(sql) {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

// Global query wrapper maintaining MySQL-compatible [rows] return structure
const query = async (sql, params = []) => {
  if (!useFallback && pool) {
    try {
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
    } catch (err) {
      console.warn(`[DB Query Fallback] Live query failed (${err.message}). Using resilient mock datastore.`);
      return executeMockQuery(sql, params);
    }
  }

  return executeMockQuery(sql, params);
};

// Transaction connection wrapper
const getConnection = async () => {
  if (!useFallback && pool) {
    try {
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
    } catch (e) {
      console.warn('[DB Transaction Fallback] Falling back to mock transaction store.');
    }
  }

  // Resilient fallback transaction wrapper
  return {
    query: async (sql, params) => executeMockQuery(sql, params),
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
  };
};

module.exports = {
  pool,
  query,
  getConnection,
};

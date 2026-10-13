// macromate-backend/scripts/initDb.js
const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const { generateMemberId } = require('../utils/memberIdGenerator');

const initDb = async () => {
  console.log('Initializing PostgreSQL / Supabase Database Schema...');
  try {
    // 1. Run PostgreSQL Schema
    const schemaPath = path.join(__dirname, '../migrations/schema_postgres.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const queries = sql.split(';').filter(q => q.trim().length > 0);
      for (const queryText of queries) {
        try {
          await db.query(queryText);
        } catch (e) {
          console.log('Schema statement note:', e.message);
        }
      }
      console.log('PostgreSQL Schema initialized.');
    }

    // 2. Run Seed Data
    const seedPath = path.join(__dirname, '../seed_postgres.sql');
    if (fs.existsSync(seedPath)) {
      const sql = fs.readFileSync(seedPath, 'utf8');
      const queries = sql.split(';').filter(q => q.trim().length > 0);
      for (const queryText of queries) {
        try {
          await db.query(queryText);
        } catch (e) {
          console.log('Seed statement note:', e.message);
        }
      }
      console.log('Seed Data inserted.');
    }

    // 3. Backfill Member IDs
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [clients] = await connection.query(
        "SELECT id, name FROM users WHERE role = 'client' AND member_id IS NULL ORDER BY id ASC"
      );
      for (const client of clients) {
        const newId = await generateMemberId(connection);
        await connection.query('UPDATE users SET member_id = ? WHERE id = ?', [newId, client.id]);
        console.log(`Assigned ${newId} to ${client.name}`);
      }
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      console.error('Backfill note:', err.message);
    } finally {
      connection.release();
    }

    console.log('PostgreSQL / Supabase Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initDb();

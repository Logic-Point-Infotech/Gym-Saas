// macromate-backend/scripts/initDb.js
const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const { generateMemberId } = require('../utils/memberIdGenerator');

const initDb = async () => {
  console.log('Initializing database schema and migrations...');
  try {
    const migrationPath = path.join(__dirname, '../migrations/addMemberId.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const queries = sql.split(';').filter(q => q.trim().length > 0);
      for (const query of queries) {
        try {
          await db.query(query);
          console.log('Ran query:', query.substring(0, 50) + '...');
        } catch (e) {
          // Ignore duplicate column / index errors if already applied
          if (!e.message.includes('Duplicate column name') && !e.message.includes('Duplicate key name')) {
            console.log('Migration note:', e.message);
          }
        }
      }
    }

    // Backfill member IDs
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [clients] = await connection.query(
        'SELECT id, name FROM users WHERE role = "client" AND member_id IS NULL ORDER BY id ASC'
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

    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initDb();

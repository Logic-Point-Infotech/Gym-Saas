// macromate-backend/scripts/backfillMemberIds.js
const db = require('../config/db');
const { generateMemberId } = require('../utils/memberIdGenerator');

const backfill = async () => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [clients] = await connection.query(
      'SELECT id, name FROM users WHERE role = "client" AND member_id IS NULL ORDER BY id ASC'
    );

    console.log(`Found ${clients.length} clients to backfill.`);

    for (const client of clients) {
      const newId = await generateMemberId(connection);
      await connection.query('UPDATE users SET member_id = ? WHERE id = ?', [newId, client.id]);
      console.log(`Assigned ${newId} to ${client.name} (ID: ${client.id})`);
    }

    await connection.commit();
    console.log('Backfill completed successfully.');
  } catch (error) {
    await connection.rollback();
    console.error('Backfill failed:', error);
  } finally {
    connection.release();
    process.exit(0);
  }
};

backfill();

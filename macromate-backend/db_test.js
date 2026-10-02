const db = require('./config/db');
async function test() {
  try {
    console.log('Testing DB connection...');
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('DB Connection successful, result:', rows[0].result);
    process.exit(0);
  } catch (err) {
    console.error('DB Connection failed:');
    console.error(err);
    process.exit(1);
  }
}
test();

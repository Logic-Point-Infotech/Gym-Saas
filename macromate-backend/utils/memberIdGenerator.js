// macromate-backend/utils/memberIdGenerator.js
const generateMemberId = async (connection) => {
  const currentYear = new Date().getFullYear();
  const prefix = `MM-${currentYear}-`;

  const [rows] = await connection.query(
    'SELECT member_id FROM users WHERE member_id LIKE ? ORDER BY member_id DESC LIMIT 1',
    [`${prefix}%`]
  );

  let nextNumber = 1;
  if (rows.length > 0) {
    const lastId = rows[0].member_id;
    const lastNumber = parseInt(lastId.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  const paddedNumber = String(nextNumber).padStart(5, '0');
  return `${prefix}${paddedNumber}`;
};

module.exports = { generateMemberId };

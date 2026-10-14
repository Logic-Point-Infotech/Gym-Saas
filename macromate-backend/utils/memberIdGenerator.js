// macromate-backend/utils/memberIdGenerator.js
const generateMemberId = async (connection) => {
  const currentYear = new Date().getFullYear();
  const prefix = `MM-${currentYear}-`;

  const [rows] = await connection.query(
    'SELECT member_id FROM users WHERE member_id LIKE ? ORDER BY id DESC',
    [`${prefix}%`]
  );

  let nextNumber = 1;
  for (const row of rows) {
    if (row.member_id) {
      const parts = row.member_id.split('-');
      if (parts.length === 3) {
        const numPart = parseInt(parts[2], 10);
        if (!isNaN(numPart)) {
          nextNumber = numPart + 1;
          break;
        }
      }
    }
  }

  const paddedNumber = String(nextNumber).padStart(5, '0');
  return `${prefix}${paddedNumber}`;
};

module.exports = { generateMemberId };

// macromate-backend/controllers/attendanceController.js
const db = require('../config/db');

const getAttendance = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE client_id = ? ORDER BY check_in DESC LIMIT 30',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAttendance };

// macromate-backend/controllers/notificationController.js
const db = require('../config/db');

const getNotifications = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await db.query('UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead };

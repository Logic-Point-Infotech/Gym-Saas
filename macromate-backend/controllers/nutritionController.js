// macromate-backend/controllers/nutritionController.js
const db = require('../config/db');

const getTodayLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    let [logs] = await db.query(
      'SELECT * FROM daily_nutrition_logs WHERE client_id = ? AND log_date = ?',
      [userId, today]
    );

    if (logs.length === 0) {
      const [result] = await db.query(
        'INSERT INTO daily_nutrition_logs (client_id, log_date, total_calories, total_protein, total_carbs, total_fat) VALUES (?, ?, 0, 0, 0, 0)',
        [userId, today]
      );
      [logs] = await db.query('SELECT * FROM daily_nutrition_logs WHERE id = ?', [result.insertId]);
    }

    const log = logs[0];
    const [meals] = await db.query(
      'SELECT * FROM meal_entries WHERE log_id = ? ORDER BY logged_at DESC',
      [log.id]
    );

    res.json({ ...log, meals });
  } catch (error) {
    next(error);
  }
};

const logMeal = async (req, res, next) => {
  const { meal_type, detected_foods, total_calories, total_protein, total_carbs, total_fat, image_url } = req.body;
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    await db.query('START TRANSACTION');

    try {
      let [logs] = await db.query(
        'SELECT id FROM daily_nutrition_logs WHERE client_id = ? AND log_date = ?',
        [userId, today]
      );

      let logId;
      if (logs.length === 0) {
        const [result] = await db.query(
          'INSERT INTO daily_nutrition_logs (client_id, log_date, total_calories, total_protein, total_carbs, total_fat) VALUES (?, ?, 0, 0, 0, 0)',
          [userId, today]
        );
        logId = result.insertId;
      } else {
        logId = logs[0].id;
      }

      const [mealResult] = await db.query(
        'INSERT INTO meal_entries (log_id, meal_type, detected_foods, total_calories, total_protein, total_carbs, total_fat, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [logId, meal_type, JSON.stringify(detected_foods), total_calories, total_protein, total_carbs, total_fat, image_url]
      );

      await db.query(
        'UPDATE daily_nutrition_logs SET total_calories = total_calories + ?, total_protein = total_protein + ?, total_carbs = total_carbs + ?, total_fat = total_fat + ? WHERE id = ?',
        [total_calories, total_protein, total_carbs, total_fat, logId]
      );

      await db.query('COMMIT');
      res.status(201).json({ id: mealResult.insertId, message: 'Meal logged successfully' });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const getNutritionHistory = async (req, res, next) => {
  try {
    const [logs] = await db.query(
      'SELECT * FROM daily_nutrition_logs WHERE client_id = ? ORDER BY log_date DESC LIMIT 14',
      [req.user.id]
    );

    const history = await Promise.all(
      logs.map(async (log) => {
        const [meals] = await db.query('SELECT * FROM meal_entries WHERE log_id = ?', [log.id]);
        return { ...log, meals };
      })
    );

    res.json(history);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodayLog, logMeal, getNutritionHistory };

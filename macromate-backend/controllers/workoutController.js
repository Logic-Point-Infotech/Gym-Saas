// macromate-backend/controllers/workoutController.js
const db = require('../config/db');

const getWorkoutPlan = async (req, res, next) => {
  try {
    const [plans] = await db.query(
      'SELECT * FROM workout_plans WHERE client_id = ? AND is_published = true ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    if (plans.length === 0) {
      return res.status(404).json({ message: 'No published workout plan found' });
    }

    const plan = plans[0];
    const [days] = await db.query('SELECT * FROM workout_days WHERE plan_id = ? ORDER BY day_number', [plan.id]);

    const nestedPlan = await Promise.all(
      days.map(async (day) => {
        const [exercises] = await db.query(
          `SELECT wde.*, e.name, e.muscle_group, e.equipment, e.description
           FROM workout_day_exercises wde
           JOIN exercises e ON wde.exercise_id = e.id
           WHERE wde.day_id = ?
           ORDER BY wde.order_index`,
          [day.id]
        );
        return { ...day, exercises };
      })
    );

    res.json({ ...plan, days: nestedPlan });
  } catch (error) {
    next(error);
  }
};

const logWorkout = async (req, res, next) => {
  const { plan_id, day_id, logged_date, duration_minutes, notes, set_logs } = req.body;
  const userId = req.user.id;

  try {
    await db.query('START TRANSACTION');

    try {
      const [result] = await db.query(
        'INSERT INTO workout_logs (client_id, plan_id, day_id, logged_date, duration_minutes, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, plan_id, day_id, logged_date, duration_minutes, notes]
      );
      const logId = result.insertId;

      await Promise.all(
        set_logs.map((set) =>
          db.query(
            'INSERT INTO workout_set_logs (workout_log_id, exercise_id, set_number, reps_done, weight_kg, is_completed) VALUES (?, ?, ?, ?, ?, ?)',
            [logId, set.exercise_id, set.set_number, set.reps_done, set.weight_kg, set.is_completed]
          )
        )
      );

      await db.query('COMMIT');
      res.status(201).json({ id: logId, message: 'Workout logged successfully' });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const getWorkoutHistory = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT wl.*, wd.focus as day_focus,
              (SELECT COUNT(*) FROM workout_set_logs WHERE workout_log_id = wl.id AND is_completed = true) as completed_sets
       FROM workout_logs wl
       JOIN workout_days wd ON wl.day_id = wd.id
       WHERE wl.client_id = ?
       ORDER BY wl.logged_date DESC
       LIMIT 10`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { getWorkoutPlan, logWorkout, getWorkoutHistory };

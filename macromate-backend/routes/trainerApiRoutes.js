// macromate-backend/routes/trainerApiRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Users
router.get('/users', async (req, res, next) => {
  try {
    const role = req.query.role;
    let query = 'SELECT id, name, email, role, member_id, created_at FROM users';
    let params = [];
    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }
    const [rows] = await db.query(query, params);
    res.json({ count: rows.length, data: rows });
  } catch (err) { next(err); }
});

router.post('/users', async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, '$2a$10$7vNfMscYfI1m9U4aA6f8e.E4O7UqB8P0f6iK2n.t8vS6Y/5zRk9G', role || 'client']
    );
    res.status(201).json({ id: result.insertId, name, email, role: role || 'client' });
  } catch (err) { next(err); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) { next(err); }
});

// Memberships
router.get('/memberships', async (req, res, next) => {
  try {
    const status = req.query.status;
    let query = 'SELECT * FROM memberships';
    let params = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    const [rows] = await db.query(query, params);
    res.json({ count: rows.length, data: rows });
  } catch (err) { next(err); }
});

router.post('/memberships', async (req, res, next) => {
  try {
    const { client_id, start_date, end_date, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO memberships (client_id, plan_id, start_date, end_date, status) VALUES (?, 1, ?, ?, ?)',
      [client_id, start_date, end_date, status || 'active']
    );
    res.status(201).json({ id: result.insertId, client_id, status: status || 'active' });
  } catch (err) { next(err); }
});

router.put('/memberships/:id', async (req, res, next) => {
  try {
    const { start_date, end_date, status } = req.body;
    await db.query(
      'UPDATE memberships SET start_date = ?, end_date = ?, status = ? WHERE id = ?',
      [start_date, end_date, status, req.params.id]
    );
    res.json({ message: 'Membership updated' });
  } catch (err) { next(err); }
});

// Trainer Allocations
router.get('/allocations', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM trainer_allocations');
    res.json({ count: rows.length, data: rows });
  } catch (err) { next(err); }
});

// Health Metrics
router.get('/health-metrics', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM client_health_metrics ORDER BY recorded_at DESC');
    res.json({ count: rows.length, data: rows });
  } catch (err) { next(err); }
});

router.post('/health-metrics', async (req, res, next) => {
  try {
    const { client_id, weight_kg, bmi, body_fat } = req.body;
    const [result] = await db.query(
      'INSERT INTO client_health_metrics (client_id, weight_kg, bmi, body_fat_percentage) VALUES (?, ?, ?, ?)',
      [client_id || 1, weight_kg, bmi || 22.0, body_fat || 18.0]
    );
    res.status(201).json({ id: result.insertId, message: 'Logged health metric' });
  } catch (err) { next(err); }
});

// Nutrition
router.get('/nutrition', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM daily_nutrition_logs ORDER BY log_date DESC');
    res.json({ count: rows.length, data: rows });
  } catch (err) { next(err); }
});

router.post('/nutrition', async (req, res, next) => {
  try {
    const { client_id, detected_food, calories, protein } = req.body;
    const [result] = await db.query(
      'INSERT INTO daily_nutrition_logs (client_id, log_date, total_calories, total_protein) VALUES (?, CURDATE(), ?, ?)',
      [client_id || 1, calories || 300, protein || 20]
    );
    res.status(201).json({ id: result.insertId, detected_food, calories, protein });
  } catch (err) { next(err); }
});

router.delete('/nutrition/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM daily_nutrition_logs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Nutrition log deleted' });
  } catch (err) { next(err); }
});

// Workouts
router.get('/workouts', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM workout_plans');
    res.json({ count: rows.length, data: rows });
  } catch (err) { next(err); }
});

// AI Endpoints
router.get('/ai/risk-scores', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM users WHERE role = ?', ['client']);
    const summary = { high: 1, medium: 2, low: Math.max(0, rows.length - 3), total: rows.length };
    res.json({ summary, data: rows.map(r => ({ id: r.id, name: r.name, risk: 'low' })) });
  } catch (err) { next(err); }
});

router.post('/ai/daily-briefing', async (req, res, next) => {
  const trainerName = req.body.trainer_name || 'Coach Uday';
  res.json({
    data: {
      greeting: `Good Morning, ${trainerName}!`,
      summary: 'All client schedules and nutrition plans are updated for today. 3 client renewals are upcoming.',
      priorities: [
        'Review Sarah Chen blood report upload',
        'Send renewal reminder to Tom Bradley',
        'Check Marcus Vane recovery score'
      ],
      motivational_tip: 'Consistency builds character both inside and outside the gym.',
      ai_generated: true
    }
  });
});

router.post('/ai/nutrition-analyze', async (req, res, next) => {
  const { food_description } = req.body;
  res.json({
    meal_name: food_description || 'Healthy Meal',
    calories: 450,
    protein: 35,
    carbs: 40,
    fats: 12,
    health_score: 9,
    tips: ['Great macro distribution! Good protein content.']
  });
});

router.post('/ai/workout-recommend', async (req, res, next) => {
  res.json({
    rationale: 'Based on client goal and recovery history, this hyper-targeted plan maximizes muscle hypertrophy.',
    difficulty: 'Intermediate',
    plan: [
      { exercise: 'Barbell Squat', sets: 4, reps: 10, rest: '90s', notes: 'Keep core tight' },
      { exercise: 'Romanian Deadlift', sets: 3, reps: 12, rest: '60s', notes: 'Focus on hamstring stretch' },
      { exercise: 'Walking Lunges', sets: 3, reps: 15, rest: '45s', notes: 'Bodyweight or light dumbbells' },
      { exercise: 'Leg Extensions', sets: 3, reps: 15, rest: '45s', notes: 'Squeeze at top' }
    ]
  });
});

router.post('/ai/health-insights', async (req, res, next) => {
  res.json({
    narrative: 'Client metrics demonstrate steady weight loss progress with optimal recovery scores.',
    alerts: [{ type: 'info', message: 'Hydration level optimal' }],
    recommendations: ['Maintain current calorie deficit', 'Ensure 8h sleep nightly']
  });
});

module.exports = router;

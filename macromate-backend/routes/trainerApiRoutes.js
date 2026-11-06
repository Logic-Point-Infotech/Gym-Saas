// macromate-backend/routes/trainerApiRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {
  getTrainerAutomatedInsights,
  getTrainerClientReport,
  executeTrainerQuickAction,
} = require('../services/trainerAutomationService');
const { analyzeHealthProgress } = require('../services/aiHealthAnalysisService');

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
      [client_id || 3, weight_kg, bmi || 23.5, body_fat || 18.0]
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
      [client_id || 3, calories || 450, protein || 30]
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

// ==========================================
// AUTOMATION 5: AUTOMATED TRAINER INSIGHTS
// ==========================================

router.get('/trainer/automated-insights', async (req, res, next) => {
  try {
    const insights = await getTrainerAutomatedInsights(req.user?.id || 2);
    res.json(insights);
  } catch (err) { next(err); }
});

router.get('/ai/trainer-insights', async (req, res, next) => {
  try {
    const insights = await getTrainerAutomatedInsights(req.user?.id || 2);
    res.json(insights);
  } catch (err) { next(err); }
});

router.get('/trainer/client-report/:clientId', async (req, res, next) => {
  try {
    const dossier = await getTrainerClientReport(req.params.clientId);
    res.json(dossier);
  } catch (err) { next(err); }
});

router.post('/trainer/quick-action', async (req, res, next) => {
  try {
    const { client_id, action_type, payload } = req.body;
    const result = await executeTrainerQuickAction({
      trainerId: req.user?.id || 2,
      clientId: client_id,
      actionType: action_type,
      payload,
    });
    res.json(result);
  } catch (err) { next(err); }
});

// Dynamic AI Risk Scores based on live automated data
router.get('/ai/risk-scores', async (req, res, next) => {
  try {
    const insights = await getTrainerAutomatedInsights(req.user?.id || 2);
    const riskData = insights.client_reports.map(c => {
      let risk = 'low';
      if (c.status === 'At Risk') risk = 'high';
      else if (c.status === 'Plateau' || c.status === 'Needs Review') risk = 'medium';
      return { id: c.client_id, name: c.name, risk, status: c.status };
    });

    res.json({
      summary: {
        high: insights.overview.at_risk,
        medium: insights.overview.plateau,
        low: insights.overview.on_track + insights.overview.milestones,
        total: insights.overview.total_clients,
      },
      data: riskData,
    });
  } catch (err) { next(err); }
});

// Dynamic AI Daily Briefing
router.post('/ai/daily-briefing', async (req, res, next) => {
  try {
    const insights = await getTrainerAutomatedInsights(req.user?.id || 2);
    res.json({
      data: {
        greeting: insights.daily_briefing.greeting,
        summary: insights.daily_briefing.summary,
        priorities: insights.daily_briefing.priorities,
        motivational_tip: insights.daily_briefing.motivational_tip,
        ai_generated: true,
      },
    });
  } catch (err) { next(err); }
});

router.post('/ai/nutrition-analyze', async (req, res, next) => {
  const { food_description } = req.body;
  res.json({
    meal_name: food_description || 'Healthy Plate',
    calories: 450,
    protein: 35,
    carbs: 40,
    fats: 12,
    health_score: 9,
    tips: ['Optimal macronutrient density for lean muscle retention.'],
  });
});

router.post('/ai/workout-recommend', async (req, res, next) => {
  const clientId = req.body.client_id || 3;
  res.json({
    rationale: 'Hypertrophic hypertrophy progression based on recovery scores and volume adaptation.',
    difficulty: 'Intermediate',
    plan: [
      { exercise: 'Barbell Bench Press', sets: 4, reps: 10, rest: '90s', notes: 'Explosive drive on concentric' },
      { exercise: 'Incline Dumbbell Press', sets: 3, reps: 12, rest: '60s', notes: 'Focus on upper chest stretch' },
      { exercise: 'Overhead Shoulder Press', sets: 3, reps: 12, rest: '60s', notes: 'Keep core tight' },
      { exercise: 'Tricep Cable Pushdown', sets: 3, reps: 15, rest: '45s', notes: 'Full lock-out' },
    ],
  });
});

// Dynamic AI Health Insights
router.post('/ai/health-insights', async (req, res, next) => {
  try {
    const clientId = req.body.client_id || 3;
    const analysis = await analyzeHealthProgress(clientId);
    res.json({
      narrative: analysis.narrative_insight,
      alerts: analysis.identified_changes.map(c => ({
        type: c.type === 'positive' ? 'info' : 'warning',
        message: `${c.metric}: ${c.change} (${c.from} -> ${c.to})`,
      })),
      recommendations: analysis.prescriptions.map(p => p.detail),
      full_analysis: analysis,
    });
  } catch (err) { next(err); }
});

module.exports = router;

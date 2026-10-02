// macromate-backend/controllers/profileController.js
const db = require('../config/db');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT u.id, u.name, u.email, u.phone, u.profile_photo_url, u.member_id,
             cp.age, cp.gender, cp.height_cm, cp.weight_kg, cp.bmi,
             cp.fitness_goal, cp.dietary_preference, cp.activity_level, cp.daily_calorie_target,
             m.status as membership_status
      FROM users u
      LEFT JOIN client_profiles cp ON u.id = cp.client_id
      LEFT JOIN memberships m ON u.id = m.client_id
      WHERE u.id = ?
      ORDER BY m.end_date DESC LIMIT 1
    `;

    const [rows] = await db.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, phone, age, weight_kg, height_cm, activity_level, fitness_goal, dietary_preference } = req.body;
  const userId = req.user.id;

  try {
    await db.query('START TRANSACTION');

    try {
      if (name || phone) {
        let userFields = [];
        let params = [];
        if (name) { userFields.push('name = ?'); params.push(name); }
        if (phone) { userFields.push('phone = ?'); params.push(phone); }
        params.push(userId);
        await db.query(`UPDATE users SET ${userFields.join(', ')} WHERE id = ?`, params);
      }

      const [currentProfile] = await db.query('SELECT height_cm, weight_kg FROM client_profiles WHERE client_id = ?', [userId]);
      const h = height_cm || (currentProfile[0]?.height_cm || 0);
      const w = weight_kg || (currentProfile[0]?.weight_kg || 0);
      const height_m = h / 100;
      const bmi = height_m > 0 ? (w / (height_m * height_m)).toFixed(1) : 0;

      let profileFields = [];
      let profileParams = [];
      if (age) { profileFields.push('age = ?'); profileParams.push(age); }
      if (weight_kg) { profileFields.push('weight_kg = ?'); profileParams.push(weight_kg); }
      if (height_cm) { profileFields.push('height_cm = ?'); profileParams.push(height_cm); }
      if (activity_level) { profileFields.push('activity_level = ?'); profileParams.push(activity_level); }
      if (fitness_goal) { profileFields.push('fitness_goal = ?'); profileParams.push(fitness_goal); }
      if (dietary_preference) { profileFields.push('dietary_preference = ?'); profileParams.push(dietary_preference); }
      profileFields.push('bmi = ?'); profileParams.push(bmi);
      profileParams.push(userId);

      await db.query(`UPDATE client_profiles SET ${profileFields.join(', ')} WHERE client_id = ?`, profileParams);

      await db.query('COMMIT');
      res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const getMemberHistory = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [memberships] = await db.query(`
      SELECT mp.name as plan_name, g.name as gym_name, m.start_date, m.end_date, m.status, m.amount_paid, m.payment_status
      FROM memberships m
      JOIN membership_plans mp ON m.plan_id = mp.id
      JOIN gyms g ON mp.gym_id = g.id
      WHERE m.client_id = ?
      ORDER BY m.start_date DESC
    `, [userId]);

    const [trainer_history] = await db.query(`
      SELECT u.name as trainer_name, ta.assigned_at as from_date,
      LEAD(ta.assigned_at) OVER (ORDER BY ta.assigned_at) as next_assigned
      FROM trainer_allocations ta
      JOIN users u ON ta.trainer_id = u.id
      WHERE ta.client_id = ?
      ORDER BY ta.assigned_at DESC
    `, [userId]);

    const formattedTrainerHistory = trainer_history.map((h, i) => ({
      trainer_name: h.trainer_name,
      from_date: h.from_date,
      to_date: i === 0 ? 'Present' : h.next_assigned
    }));

    const [health_metrics] = await db.query(`
      SELECT weight_kg, bmi, body_fat_percentage, muscle_mass_kg, notes, recorded_at
      FROM client_health_metrics
      WHERE client_id = ?
      ORDER BY recorded_at DESC
      LIMIT 20
    `, [userId]);

    const [nutrition_summary] = await db.query(`
      SELECT log_date, total_calories, total_protein, total_carbs, total_fat
      FROM daily_nutrition_logs
      WHERE client_id = ?
      ORDER BY log_date DESC
      LIMIT 30
    `, [userId]);

    const [blood_documents] = await db.query(`
      SELECT blood_report_url, blood_report_json, recorded_at
      FROM client_health_metrics
      WHERE client_id = ? AND blood_report_url IS NOT NULL
      ORDER BY recorded_at DESC
    `, [userId]);

    res.json({
      memberships,
      trainer_history: formattedTrainerHistory,
      health_metrics,
      nutrition_summary,
      blood_documents
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getMemberHistory };

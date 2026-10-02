// macromate-backend/controllers/healthController.js
const db = require('../config/db');

const getHealthMetrics = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM client_health_metrics WHERE client_id = ? ORDER BY recorded_at DESC LIMIT 10',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const logHealthMetrics = async (req, res, next) => {
  const { weight_kg, body_fat_percentage, muscle_mass_kg, notes } = req.body;
  const userId = req.user.id;

  try {
    const [profile] = await db.query('SELECT height_cm FROM client_profiles WHERE client_id = ?', [userId]);
    const height_m = profile[0].height_cm / 100;
    const bmi = (weight_kg / (height_m * height_m)).toFixed(1);

    await db.query('START TRANSACTION');

    try {
      await db.query(
        'INSERT INTO client_health_metrics (client_id, weight_kg, bmi, body_fat_percentage, muscle_mass_kg, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, weight_kg, bmi, body_fat_percentage, muscle_mass_kg, notes]
      );

      await db.query(
        'UPDATE client_profiles SET weight_kg = ?, bmi = ? WHERE client_id = ?',
        [weight_kg, bmi, userId]
      );

      await db.query('COMMIT');
      res.status(201).json({ message: 'Metrics logged successfully', bmi });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const uploadBloodReport = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const reportUrl = req.file.path;
    const mockInsights = {
      vitamin_d: { value: 15, unit: 'ng/mL', status: 'Low' },
      cholesterol: { value: 180, unit: 'mg/dL', status: 'Normal' },
      hemoglobin: { value: 13.5, unit: 'g/dL', status: 'Normal' },
      blood_sugar: { value: 95, unit: 'mg/dL', status: 'Normal' },
      calcium: { value: 8.2, unit: 'mg/dL', status: 'Normal' },
    };

    await db.query(
      'INSERT INTO client_health_metrics (client_id, blood_report_url, blood_report_json) VALUES (?, ?, ?)',
      [req.user.id, reportUrl, JSON.stringify(mockInsights)]
    );

    res.status(201).json({
      blood_report_url: reportUrl,
      insights: mockInsights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHealthMetrics, logHealthMetrics, uploadBloodReport };

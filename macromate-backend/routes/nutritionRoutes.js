// macromate-backend/routes/nutritionRoutes.js
const express = require('express');
const router = express.Router();
const { getTodayLog, logMeal, getNutritionHistory } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/log/today', protect, getTodayLog);
router.post('/meal', protect, logMeal);
router.get('/history', protect, getNutritionHistory);

module.exports = router;

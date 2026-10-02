// macromate-backend/routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const { getWorkoutPlan, logWorkout, getWorkoutHistory } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plan', protect, getWorkoutPlan);
router.post('/log', protect, logWorkout);
router.get('/history', protect, getWorkoutHistory);

module.exports = router;

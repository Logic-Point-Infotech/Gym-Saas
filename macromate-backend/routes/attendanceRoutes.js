// macromate-backend/routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { getAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAttendance);

module.exports = router;

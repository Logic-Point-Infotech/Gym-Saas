// macromate-backend/routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getHealthMetrics, logHealthMetrics, uploadBloodReport } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blood_reports/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

router.get('/metrics', protect, getHealthMetrics);
router.post('/metrics', protect, logHealthMetrics);
router.post('/blood-report', protect, upload.single('blood_report'), uploadBloodReport);

module.exports = router;

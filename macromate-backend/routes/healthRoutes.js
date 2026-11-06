// macromate-backend/routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getHealthMetrics, logHealthMetrics, uploadBloodReport } = require('../controllers/healthController');
const {
  getAutomatedHealthReportHandler,
  generateAutomatedHealthReportHandler,
  getAIHealthAnalysisHandler,
  getProgressSummaryHandler,
} = require('../controllers/automationController');
const { protect, optionalProtect } = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blood_reports/');
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'client';
    cb(null, `${userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF or image files are allowed'), false);
    }
  },
});

// Standard Health Metrics
router.get('/metrics', optionalProtect, getHealthMetrics);
router.post('/metrics', optionalProtect, logHealthMetrics);
router.post('/blood-report', optionalProtect, upload.single('blood_report'), uploadBloodReport);

// AUTOMATION 1: Automated Health Reports
router.get('/automated-report', optionalProtect, getAutomatedHealthReportHandler);
router.get('/automated-report/:clientId', optionalProtect, getAutomatedHealthReportHandler);
router.post('/automated-report/generate', optionalProtect, generateAutomatedHealthReportHandler);

// AUTOMATION 2: AI Health Analysis
router.get('/ai-analysis', optionalProtect, getAIHealthAnalysisHandler);
router.get('/ai-analysis/:clientId', optionalProtect, getAIHealthAnalysisHandler);

// AUTOMATION 4: Progress Monitoring
router.get('/progress-summary', optionalProtect, getProgressSummaryHandler);
router.get('/progress-summary/:clientId', optionalProtect, getProgressSummaryHandler);

module.exports = router;

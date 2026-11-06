// macromate-backend/controllers/automationController.js
const { generateAutomatedReport } = require('../services/automatedHealthReportService');
const { analyzeHealthProgress } = require('../services/aiHealthAnalysisService');
const { analyzeMealPhoto } = require('../services/nutritionVisionService');
const { getClientProgressSummary } = require('../services/progressMonitoringService');
const {
  getTrainerAutomatedInsights,
  getTrainerClientReport,
  executeTrainerQuickAction,
} = require('../services/trainerAutomationService');

// 1. Automated Health Reports
const getAutomatedHealthReportHandler = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.user?.id || 3;
    const report = await generateAutomatedReport(clientId);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

const generateAutomatedHealthReportHandler = async (req, res, next) => {
  try {
    const clientId = req.body.client_id || req.user?.id || 3;
    const report = await generateAutomatedReport(clientId);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

// 2. AI Health Analysis
const getAIHealthAnalysisHandler = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.user?.id || 3;
    const analysis = await analyzeHealthProgress(clientId);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};

// 3. Automated Nutrition Tracking from Photo
const analyzeMealPhotoHandler = async (req, res, next) => {
  try {
    const { image_url, image_base64, meal_type, auto_log } = req.body;
    const clientId = req.user?.id || 3;

    // Handle file upload if multipart/form-data
    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = req.file.path;
    }

    const result = await analyzeMealPhoto({
      imageUrl: finalImageUrl,
      imageBase64: image_base64,
      mealType: meal_type,
      autoLog: auto_log !== false, // defaults to auto-logging for zero friction
      clientId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 4. Progress Monitoring
const getProgressSummaryHandler = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || req.user?.id || 3;
    const timeframeDays = parseInt(req.query.timeframe, 10) || 30;
    const summary = await getClientProgressSummary(clientId, timeframeDays);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

// 5. Automated Trainer Insights
const getTrainerAutomatedInsightsHandler = async (req, res, next) => {
  try {
    const trainerId = req.user?.id || 2;
    const insights = await getTrainerAutomatedInsights(trainerId);
    res.json(insights);
  } catch (error) {
    next(error);
  }
};

const getTrainerClientReportHandler = async (req, res, next) => {
  try {
    const clientId = req.params.clientId || 3;
    const report = await getTrainerClientReport(clientId);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

const executeTrainerQuickActionHandler = async (req, res, next) => {
  try {
    const trainerId = req.user?.id || 2;
    const { client_id, action_type, payload } = req.body;
    const result = await executeTrainerQuickAction({
      trainerId,
      clientId: client_id,
      actionType: action_type,
      payload,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAutomatedHealthReportHandler,
  generateAutomatedHealthReportHandler,
  getAIHealthAnalysisHandler,
  analyzeMealPhotoHandler,
  getProgressSummaryHandler,
  getTrainerAutomatedInsightsHandler,
  getTrainerClientReportHandler,
  executeTrainerQuickActionHandler,
};

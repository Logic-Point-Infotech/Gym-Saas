// macromate-backend/routes/nutritionRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getTodayLog, logMeal, getNutritionHistory } = require('../controllers/nutritionController');
const { analyzeMealPhotoHandler } = require('../controllers/automationController');
const { protect, optionalProtect } = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/meals/');
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'client';
    cb(null, `meal_${userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.get('/log/today', optionalProtect, getTodayLog);
router.post('/meal', optionalProtect, logMeal);
router.get('/history', optionalProtect, getNutritionHistory);

// AUTOMATION 3: Automated Nutrition Tracking from Photo
router.post('/analyze-photo', optionalProtect, upload.single('meal_photo'), analyzeMealPhotoHandler);

module.exports = router;

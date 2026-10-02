// macromate-backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getMemberHistory } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.get('/member-history', protect, getMemberHistory);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  recordFootfall,
  getAnalyticsSummary,
  getMLPredictions
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/footfall', recordFootfall);

// Protected routes
router.get('/summary/:vendorId', protect, getAnalyticsSummary);
router.get('/predictions/:vendorId', protect, getMLPredictions);

module.exports = router;
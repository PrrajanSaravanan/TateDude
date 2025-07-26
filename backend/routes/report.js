const express = require('express');
const router = express.Router();
const {
  generateMonthlyReport,
  shareReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

// Protected routes
router.get('/:vendorId', protect, generateMonthlyReport);
router.post('/share', protect, shareReport);

module.exports = router;
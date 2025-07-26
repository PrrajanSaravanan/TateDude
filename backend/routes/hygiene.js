const express = require('express');
const router = express.Router();
const {
  checkHygiene,
  getHygieneHistory,
  getHygieneBadge,
  verifyHygieneCheck
} = require('../controllers/hygieneController');
const { protect, isVendor, authorize } = require('../middleware/auth');

// Public routes
router.get('/history/:vendorId', getHygieneHistory);
router.get('/badge/:vendorId', getHygieneBadge);

// Protected routes
router.post('/check', protect, isVendor, checkHygiene);
router.put('/verify/:checkId', protect, authorize('admin'), verifyHygieneCheck);

module.exports = router;
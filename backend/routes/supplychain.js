const express = require('express');
const router = express.Router();
const {
  createTransaction,
  uploadBill,
  getSupplyChain,
  getTransactionByHash,
  verifyChain,
  rateEntity
} = require('../controllers/supplyChainController');
const { protect, isVendor } = require('../middleware/auth');

// Public routes
router.get('/:vendorId', getSupplyChain);
router.get('/transaction/:hash', getTransactionByHash);
router.get('/verify/:vendorId', verifyChain);

// Protected routes
router.post('/transaction', protect, isVendor, createTransaction);
router.post('/upload-bill', protect, isVendor, uploadBill);
router.post('/rate', protect, rateEntity);

module.exports = router;
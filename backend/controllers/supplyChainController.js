const Transaction = require('../models/transaction');
const Vendor = require('../models/vendor');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/bills/')
  },
  filename: function (req, file, cb) {
    cb(null, `bill-${Date.now()}${path.extname(file.originalname)}`)
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG and PDF files are allowed'));
    }
  }
}).single('billDocument');

// @desc    Create a new supply chain transaction
// @route   POST /api/supplychain/transaction
// @access  Private (Vendor only)
exports.createTransaction = async (req, res, next) => {
  try {
    const vendorId = req.user.role === 'vendor' ? 
      (await Vendor.findOne({ user: req.user.id }))._id : 
      req.body.vendorId;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        error: 'Vendor ID is required'
      });
    }

    // Get the latest transaction for chaining
    const latestTransaction = await Transaction.findOne({ vendor: vendorId })
      .sort({ 'metadata.uploadedAt': -1 });

    const transactionData = {
      vendor: vendorId,
      billNumber: req.body.billNumber,
      billDate: req.body.billDate,
      supplyChain: req.body.supplyChain,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      previousTransactionHash: latestTransaction ? latestTransaction.transactionHash : null,
      metadata: {
        uploadedBy: req.user.id,
        documentUrl: req.body.documentUrl
      }
    };

    const transaction = await Transaction.create(transactionData);

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload bill document
// @route   POST /api/supplychain/upload-bill
// @access  Private (Vendor only)
exports.uploadBill = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        url: `/uploads/bills/${req.file.filename}`
      }
    });
  });
};

// @desc    Get supply chain transactions for a vendor
// @route   GET /api/supplychain/:vendorId
// @access  Public
exports.getSupplyChain = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    const transactions = await Transaction.find({ vendor: vendorId })
      .sort({ billDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('metadata.uploadedBy', 'name');

    const total = await Transaction.countDocuments({ vendor: vendorId });

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get transaction by hash
// @route   GET /api/supplychain/transaction/:hash
// @access  Public
exports.getTransactionByHash = async (req, res, next) => {
  try {
    const { hash } = req.params;

    const transaction = await Transaction.findOne({ transactionHash: hash })
      .populate('vendor', 'businessName')
      .populate('metadata.uploadedBy', 'name');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify transaction chain
// @route   GET /api/supplychain/verify/:vendorId
// @access  Public
exports.verifyChain = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const transactions = await Transaction.find({ vendor: vendorId })
      .sort({ 'metadata.uploadedAt': 1 });

    let isValid = true;
    const verificationResults = [];

    for (let i = 0; i < transactions.length; i++) {
      const current = transactions[i];
      const previous = i > 0 ? transactions[i - 1] : null;

      const result = {
        transactionHash: current.transactionHash,
        billNumber: current.billNumber,
        isValid: true,
        reason: 'Valid'
      };

      // Verify chain integrity
      if (previous && current.previousTransactionHash !== previous.transactionHash) {
        result.isValid = false;
        result.reason = 'Chain broken - previous hash mismatch';
        isValid = false;
      }

      // Verify transaction hasn't been tampered
      const crypto = require('crypto');
      const data = JSON.stringify({
        vendor: current.vendor,
        billNumber: current.billNumber,
        billDate: current.billDate,
        supplyChain: current.supplyChain,
        items: current.items,
        totalAmount: current.totalAmount,
        timestamp: new Date(current.metadata.uploadedAt).getTime()
      });
      
      const calculatedHash = crypto.createHash('sha256').update(data).digest('hex');
      
      if (calculatedHash !== current.transactionHash) {
        result.isValid = false;
        result.reason = 'Transaction data has been tampered';
        isValid = false;
      }

      verificationResults.push(result);
    }

    res.status(200).json({
      success: true,
      data: {
        chainValid: isValid,
        totalTransactions: transactions.length,
        verificationResults
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Rate a supply chain entity
// @route   POST /api/supplychain/rate
// @access  Private
exports.rateEntity = async (req, res, next) => {
  try {
    const { transactionId, entityType, entityName, rating } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Find and update the entity rating
    const entityIndex = transaction.supplyChain.findIndex(
      entity => entity.entityType === entityType && entity.entityName === entityName
    );

    if (entityIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found in supply chain'
      });
    }

    transaction.supplyChain[entityIndex].rating = rating;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};
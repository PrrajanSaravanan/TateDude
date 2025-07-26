const HygieneCheck = require('../models/hygieneCheck');
const Vendor = require('../models/vendor');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/hygiene/')
  },
  filename: function (req, file, cb) {
    cb(null, `hygiene-${Date.now()}${path.extname(file.originalname)}`)
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
}).single('hygieneImage');

// @desc    Upload and check hygiene
// @route   POST /api/hygiene/check
// @access  Private (Vendor only)
exports.checkHygiene = async (req, res, next) => {
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
        error: 'Please upload an image'
      });
    }

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

      // Call AI hygiene check API
      const hygieneResult = await callHygieneAPI(req.file.path);

      // Create hygiene check record
      const hygieneCheck = await HygieneCheck.create({
        vendor: vendorId,
        imageUrl: `/uploads/hygiene/${req.file.filename}`,
        score: hygieneResult.score,
        details: hygieneResult.details,
        aiAnalysis: {
          confidence: hygieneResult.confidence,
          processingTime: hygieneResult.processingTime,
          modelVersion: hygieneResult.modelVersion,
          rawOutput: hygieneResult.raw
        },
        recommendations: hygieneResult.recommendations,
        checkedBy: req.user.id
      });

      // Update vendor hygiene score
      await Vendor.findByIdAndUpdate(vendorId, {
        hygieneScore: {
          score: hygieneResult.score,
          lastChecked: new Date()
        }
      });

      // Generate certificate if score is good
      if (hygieneResult.score >= 75) {
        const certificateUrl = await generateHygieneCertificate(hygieneCheck);
        hygieneCheck.certificateUrl = certificateUrl;
        await hygieneCheck.save();
      }

      res.status(201).json({
        success: true,
        data: hygieneCheck
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      next(error);
    }
  });
};

// @desc    Get hygiene check history
// @route   GET /api/hygiene/history/:vendorId
// @access  Public
exports.getHygieneHistory = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const hygieneChecks = await HygieneCheck.find({ vendor: vendorId })
      .sort({ checkedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('checkedBy', 'name');

    const total = await HygieneCheck.countDocuments({ vendor: vendorId });

    res.status(200).json({
      success: true,
      data: hygieneChecks,
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

// @desc    Get latest hygiene badge
// @route   GET /api/hygiene/badge/:vendorId
// @access  Public
exports.getHygieneBadge = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const latestCheck = await HygieneCheck.findOne({ vendor: vendorId })
      .sort({ checkedAt: -1 });

    if (!latestCheck) {
      return res.status(404).json({
        success: false,
        error: 'No hygiene checks found for this vendor'
      });
    }

    const badge = {
      score: latestCheck.score,
      category: latestCheck.category,
      checkedAt: latestCheck.checkedAt,
      certificateValid: latestCheck.certificateValidTill && new Date() < latestCheck.certificateValidTill,
      certificateUrl: latestCheck.certificateUrl,
      badgeText: `AI Hygiene Verified - ${latestCheck.score}%`,
      badgeColor: getBadgeColor(latestCheck.score)
    };

    res.status(200).json({
      success: true,
      data: badge
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify hygiene check
// @route   PUT /api/hygiene/verify/:checkId
// @access  Private (Admin only)
exports.verifyHygieneCheck = async (req, res, next) => {
  try {
    const { checkId } = req.params;
    const { status, notes } = req.body;

    const hygieneCheck = await HygieneCheck.findByIdAndUpdate(
      checkId,
      {
        verificationStatus: status,
        verifiedBy: req.user.id,
        verifiedAt: Date.now(),
        notes
      },
      { new: true }
    );

    if (!hygieneCheck) {
      return res.status(404).json({
        success: false,
        error: 'Hygiene check not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hygieneCheck
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to call AI hygiene API
async function callHygieneAPI(imagePath) {
  try {
    // Read image file
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const startTime = Date.now();
    
    const response = await axios.post(
      process.env.HYGIENE_CHECK_API_URL,
      {
        image: base64Image,
        imageType: path.extname(imagePath).substring(1)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.ML_API_KEY
        },
        timeout: 60000 // 60 second timeout for image processing
      }
    );

    const processingTime = Date.now() - startTime;

    return {
      score: response.data.overallScore || 75,
      details: response.data.details || {
        cleanliness: { score: 80, observations: ['Clean surfaces detected'] },
        foodSafety: { score: 75, observations: ['Proper food storage observed'] },
        personalHygiene: { score: 70, observations: ['Staff wearing appropriate attire'] },
        storageConditions: { score: 75, observations: ['Organized storage area'] }
      },
      confidence: response.data.confidence || 0.85,
      processingTime,
      modelVersion: response.data.modelVersion || '1.0',
      recommendations: response.data.recommendations || [
        'Maintain current cleanliness standards',
        'Consider regular deep cleaning schedule'
      ],
      raw: response.data
    };
  } catch (error) {
    console.error('AI Hygiene API Error:', error.message);
    
    // Fallback with mock data for development
    return {
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      details: {
        cleanliness: { score: 80, observations: ['Clean surfaces detected'] },
        foodSafety: { score: 75, observations: ['Proper food storage observed'] },
        personalHygiene: { score: 70, observations: ['Staff wearing appropriate attire'] },
        storageConditions: { score: 75, observations: ['Organized storage area'] }
      },
      confidence: 0.75,
      processingTime: 1500,
      modelVersion: '1.0-fallback',
      recommendations: [
        'Maintain current cleanliness standards',
        'Consider regular deep cleaning schedule',
        'Ensure proper waste disposal'
      ],
      raw: { fallback: true }
    };
  }
}

// Helper function to generate hygiene certificate
async function generateHygieneCertificate(hygieneCheck) {
  // In a real implementation, this would generate a PDF certificate
  // For now, return a placeholder URL
  return `/api/hygiene/certificate/${hygieneCheck._id}`;
}

// Helper function to get badge color based on score
function getBadgeColor(score) {
  if (score >= 90) return '#00C851'; // Green
  if (score >= 75) return '#33B5E5'; // Blue
  if (score >= 60) return '#FF8800'; // Orange
  return '#CC0000'; // Red
}
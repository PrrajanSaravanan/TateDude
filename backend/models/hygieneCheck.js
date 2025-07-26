const mongoose = require('mongoose');

const hygieneCheckSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  checkId: {
    type: String,
    unique: true,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor', 'critical'],
    required: true
  },
  details: {
    cleanliness: {
      score: Number,
      observations: [String]
    },
    foodSafety: {
      score: Number,
      observations: [String]
    },
    personalHygiene: {
      score: Number,
      observations: [String]
    },
    storageConditions: {
      score: Number,
      observations: [String]
    }
  },
  aiAnalysis: {
    confidence: Number,
    processingTime: Number,
    modelVersion: String,
    rawOutput: mongoose.Schema.Types.Mixed
  },
  recommendations: [String],
  certificateUrl: String,
  certificateValidTill: Date,
  checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkedAt: {
    type: Date,
    default: Date.now
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  notes: String
});

// Create indexes
hygieneCheckSchema.index({ vendor: 1, checkedAt: -1 });
hygieneCheckSchema.index({ checkId: 1 });

// Generate check ID before saving
hygieneCheckSchema.pre('save', async function(next) {
  if (!this.checkId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    this.checkId = `HYG-${dateStr}-${random}`;
  }
  
  // Set category based on score
  if (this.score >= 90) {
    this.category = 'excellent';
  } else if (this.score >= 75) {
    this.category = 'good';
  } else if (this.score >= 60) {
    this.category = 'average';
  } else if (this.score >= 40) {
    this.category = 'poor';
  } else {
    this.category = 'critical';
  }
  
  // Set certificate validity (30 days from check date)
  if (this.score >= 75 && !this.certificateValidTill) {
    const validTill = new Date(this.checkedAt);
    validTill.setDate(validTill.getDate() + 30);
    this.certificateValidTill = validTill;
  }
  
  next();
});

module.exports = mongoose.model('HygieneCheck', hygieneCheckSchema);
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  transactionHash: {
    type: String,
    unique: true,
    required: true
  },
  billNumber: {
    type: String,
    required: true
  },
  billDate: {
    type: Date,
    required: true
  },
  supplyChain: [{
    entityType: {
      type: String,
      enum: ['farmer', 'mandi', 'middleman', 'vendor'],
      required: true
    },
    entityName: {
      type: String,
      required: true
    },
    entityId: String,
    location: String,
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: String
  }],
  items: [{
    productName: {
      type: String,
      required: true
    },
    category: String,
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0
    },
    sellingPrice: Number,
    expiryDate: Date
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  previousTransactionHash: String,
  metadata: {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  isImmutable: {
    type: Boolean,
    default: true
  }
});

// Create indexes
transactionSchema.index({ vendor: 1, billDate: -1 });
transactionSchema.index({ transactionHash: 1 });

// Generate transaction hash before saving
transactionSchema.pre('save', async function(next) {
  if (!this.transactionHash) {
    const data = JSON.stringify({
      vendor: this.vendor,
      billNumber: this.billNumber,
      billDate: this.billDate,
      supplyChain: this.supplyChain,
      items: this.items,
      totalAmount: this.totalAmount,
      timestamp: Date.now()
    });
    
    // Simple hash generation (in production, use crypto for proper hashing)
    const crypto = require('crypto');
    this.transactionHash = crypto.createHash('sha256').update(data).digest('hex');
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
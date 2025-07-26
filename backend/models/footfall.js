const mongoose = require('mongoose');

const footfallSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  hour: {
    type: Number,
    min: 0,
    max: 23,
    required: true
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    required: true
  },
  date: {
    type: String,
    required: true // Format: YYYY-MM-DD
  },
  scanLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  userAgent: String,
  ipAddress: String,
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    default: 'unknown'
  },
  source: {
    type: String,
    enum: ['qr_scan', 'direct_visit', 'app', 'web'],
    default: 'qr_scan'
  }
});

// Create indexes for efficient queries
footfallSchema.index({ vendor: 1, timestamp: -1 });
footfallSchema.index({ vendor: 1, date: 1 });
footfallSchema.index({ vendor: 1, hour: 1 });
footfallSchema.index({ vendor: 1, dayOfWeek: 1 });

// Pre-save middleware to set hour, dayOfWeek, and date
footfallSchema.pre('save', function(next) {
  const date = new Date(this.timestamp);
  this.hour = date.getHours();
  this.dayOfWeek = date.getDay();
  this.date = date.toISOString().split('T')[0];
  next();
});

module.exports = mongoose.model('Footfall', footfallSchema);
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Please provide business name'],
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'beverages', 'snacks', 'fruits', 'vegetables', 'other']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: String,
    landmark: String
  },
  operatingHours: {
    openTime: String,
    closeTime: String,
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  menu: [{
    itemName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: String,
    category: String,
    isAvailable: {
      type: Boolean,
      default: true
    },
    image: String
  }],
  qrCode: {
    type: String,
    unique: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  hygieneScore: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    lastChecked: Date,
    certificate: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    upiId: String
  },
  documents: {
    gstNumber: String,
    fssaiLicense: String,
    panCard: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for location-based queries
vendorSchema.index({ location: '2dsphere' });

// Update the updatedAt timestamp before saving
vendorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
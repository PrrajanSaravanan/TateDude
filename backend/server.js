require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import DB connection
const connectDB = require('./config/database');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const supplyChainRoutes = require('./routes/supplychain');
const hygieneRoutes = require('./routes/hygiene');
const reportRoutes = require('./routes/report');

// Import utilities
const { createUploadDirs } = require('./config/uploadConfig');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Create upload directories
createUploadDirs();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
});
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/login', authLimiter);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/supplychain', supplyChainRoutes);
app.use('/api/hygiene', hygieneRoutes);
app.use('/api/monthly/report', reportRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Street Vendor Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        updateDetails: 'PUT /api/auth/updatedetails',
        updatePassword: 'PUT /api/auth/updatepassword',
        logout: 'GET /api/auth/logout'
      },
      analytics: {
        recordFootfall: 'POST /api/analytics/footfall',
        summary: 'GET /api/analytics/summary/:vendorId',
        predictions: 'GET /api/analytics/predictions/:vendorId'
      },
      supplyChain: {
        getTransactions: 'GET /api/supplychain/:vendorId',
        getByHash: 'GET /api/supplychain/transaction/:hash',
        verify: 'GET /api/supplychain/verify/:vendorId',
        create: 'POST /api/supplychain/transaction',
        uploadBill: 'POST /api/supplychain/upload-bill',
        rate: 'POST /api/supplychain/rate'
      },
      hygiene: {
        check: 'POST /api/hygiene/check',
        history: 'GET /api/hygiene/history/:vendorId',
        badge: 'GET /api/hygiene/badge/:vendorId',
        verify: 'PUT /api/hygiene/verify/:checkId'
      },
      monthlyReport: {
        generate: 'GET /api/monthly/report/:vendorId',
        share: 'POST /api/monthly/report/share'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Street Vendor Platform Backend Server                ║
║                                                           ║
║   Server running in ${process.env.NODE_ENV} mode         ║
║   Port: ${PORT}                                          ║
║   Database: Connected                                     ║
║                                                           ║
║   Ready to serve street vendors! 🛒                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
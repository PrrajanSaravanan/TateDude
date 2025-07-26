# Street Vendor Platform Backend

A comprehensive backend solution for managing street vendors with advanced analytics, supply chain tracking, AI-powered hygiene monitoring, and monthly performance reports.

## Features

### 1. **JWT-based Authentication**
- User registration (customer, vendor, admin roles)
- Secure login with JWT tokens
- Password management
- Profile updates

### 2. **Footfall & Demand Analytics**
- QR code-based footfall tracking
- Real-time visitor counting
- Demand prediction for items
- Analytics dashboard with:
  - Most ordered items
  - Peak hours analysis
  - Day-wise footfall patterns
  - Conversion rates

### 3. **ML Integration**
- Day-wise footfall prediction
- Hour-wise footfall prediction
- Most ordered item prediction
- Integration with Python-based ML models

### 4. **Blockchain-like Supply Chain**
- Immutable transaction logs
- Complete supply chain visibility (Farmer → Mandi → Middleman → Vendor)
- Price tracking at each stage
- Entity rating system
- Chain verification

### 5. **AI HygieneScan**
- Image-based hygiene assessment
- AI-powered scoring (0-100%)
- Detailed hygiene reports
- Hygiene certificates
- Badge generation

### 6. **Street Wrapped Reports**
- Monthly performance summaries
- Best-selling items analysis
- Peak day/hour insights
- Profit/loss calculations
- PDF report generation
- WhatsApp sharing capability

## Tech Stack

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Puppeteer** - PDF generation
- **QRCode** - QR code generation
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

## Installation

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `GET /api/auth/logout` - Logout user

### Analytics
- `POST /api/analytics/footfall` - Record footfall (QR scan)
- `GET /api/analytics/summary/:vendorId` - Get analytics summary
- `GET /api/analytics/predictions/:vendorId` - Get ML predictions

### Supply Chain
- `GET /api/supplychain/:vendorId` - Get supply chain transactions
- `GET /api/supplychain/transaction/:hash` - Get transaction by hash
- `GET /api/supplychain/verify/:vendorId` - Verify chain integrity
- `POST /api/supplychain/transaction` - Create new transaction
- `POST /api/supplychain/upload-bill` - Upload bill document
- `POST /api/supplychain/rate` - Rate supply chain entity

### Hygiene
- `POST /api/hygiene/check` - Upload image for hygiene check
- `GET /api/hygiene/history/:vendorId` - Get hygiene check history
- `GET /api/hygiene/badge/:vendorId` - Get hygiene badge
- `PUT /api/hygiene/verify/:checkId` - Verify hygiene check (admin)

### Monthly Reports
- `GET /api/monthly/report/:vendorId` - Generate monthly report
- `POST /api/monthly/report/share` - Share report via WhatsApp

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── ml/              # ML API configuration
├── uploads/         # File uploads directory
└── server.js        # Entry point
```

## Environment Variables

Key environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `ML_API_URL` - Python ML API URL
- `HYGIENE_CHECK_API_URL` - Hygiene check API URL
- `PORT` - Server port (default: 5000)

## Security Features

- Helmet.js for security headers
- Rate limiting on all endpoints
- Stricter rate limiting on auth endpoints
- Input validation using express-validator
- JWT-based authentication
- CORS configuration
- File upload restrictions

## ML Integration

The backend integrates with Python-based ML models for:
1. Footfall prediction
2. Demand forecasting
3. Hygiene assessment

Ensure your ML API servers are running and configured in the `.env` file.

## Development

1. Use `npm run dev` for development with auto-reload
2. API endpoint testing available at `GET /api`
3. Health check available at `GET /health`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use proper MongoDB hosting
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Use PM2 for process management

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
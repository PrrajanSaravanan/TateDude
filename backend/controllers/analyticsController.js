const Footfall = require('../models/footfall');
const Order = require('../models/order');
const Vendor = require('../models/vendor');
const axios = require('axios');

// @desc    Record footfall when QR is scanned
// @route   POST /api/analytics/footfall
// @access  Public
exports.recordFootfall = async (req, res, next) => {
  try {
    const { vendorId, location, userAgent, source } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    const footfall = await Footfall.create({
      vendor: vendorId,
      scanLocation: location,
      userAgent,
      ipAddress: req.ip,
      source: source || 'qr_scan',
      deviceType: detectDeviceType(userAgent)
    });

    res.status(201).json({
      success: true,
      data: footfall
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get analytics summary
// @route   GET /api/analytics/summary/:vendorId
// @access  Private
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { startDate, endDate } = req.query;

    // Date range filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const filter = { vendor: vendorId };
    if (Object.keys(dateFilter).length > 0) {
      filter.timestamp = dateFilter;
    }

    // Get footfall data
    const footfallData = await Footfall.find(filter);
    
    // Get order data
    const orderFilter = { vendor: vendorId };
    if (Object.keys(dateFilter).length > 0) {
      orderFilter.orderTime = dateFilter;
    }
    const orders = await Order.find(orderFilter);

    // Calculate analytics
    const analytics = {
      totalFootfall: footfallData.length,
      totalOrders: orders.length,
      conversionRate: footfallData.length > 0 ? (orders.length / footfallData.length * 100).toFixed(2) : 0,
      
      // Most ordered items
      mostOrderedItems: getMostOrderedItems(orders),
      
      // Peak hours
      peakHours: getPeakHours(footfallData),
      
      // Day-wise footfall
      dayWiseFootfall: getDayWiseFootfall(footfallData),
      
      // Revenue analytics
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length).toFixed(2) : 0
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get ML predictions
// @route   GET /api/analytics/predictions/:vendorId
// @access  Private
exports.getMLPredictions = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    
    // Get historical data
    const historicalData = await prepareHistoricalData(vendorId);
    
    // Call ML APIs
    const predictions = await Promise.all([
      callMLAPI('/predict/footfall/daily', historicalData),
      callMLAPI('/predict/footfall/hourly', historicalData),
      callMLAPI('/predict/items', historicalData)
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyFootfallPrediction: predictions[0],
        hourlyFootfallPrediction: predictions[1],
        mostOrderedItemPrediction: predictions[2]
      }
    });
  } catch (err) {
    next(err);
  }
};

// Helper functions
function detectDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  if (/desktop/i.test(userAgent)) return 'desktop';
  
  return 'unknown';
}

function getMostOrderedItems(orders) {
  const itemCounts = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (itemCounts[item.itemName]) {
        itemCounts[item.itemName] += item.quantity;
      } else {
        itemCounts[item.itemName] = item.quantity;
      }
    });
  });
  
  return Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([itemName, count]) => ({ itemName, count }));
}

function getPeakHours(footfallData) {
  const hourCounts = {};
  
  footfallData.forEach(record => {
    const hour = record.hour;
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  return Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }));
}

function getDayWiseFootfall(footfallData) {
  const dayCounts = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  footfallData.forEach(record => {
    const day = dayNames[record.dayOfWeek];
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  return dayNames.map(day => ({
    day,
    count: dayCounts[day] || 0
  }));
}

async function prepareHistoricalData(vendorId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const [footfallData, orderData] = await Promise.all([
    Footfall.find({
      vendor: vendorId,
      timestamp: { $gte: thirtyDaysAgo }
    }),
    Order.find({
      vendor: vendorId,
      orderTime: { $gte: thirtyDaysAgo }
    })
  ]);
  
  return {
    footfall: footfallData.map(f => ({
      timestamp: f.timestamp,
      hour: f.hour,
      dayOfWeek: f.dayOfWeek,
      date: f.date
    })),
    orders: orderData.map(o => ({
      timestamp: o.orderTime,
      items: o.items,
      totalAmount: o.totalAmount
    }))
  };
}

async function callMLAPI(endpoint, data) {
  try {
    const response = await axios.post(
      `${process.env.ML_API_URL}${endpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.ML_API_KEY
        },
        timeout: 30000
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`ML API Error: ${error.message}`);
    return {
      error: 'ML prediction service temporarily unavailable',
      fallback: true
    };
  }
}
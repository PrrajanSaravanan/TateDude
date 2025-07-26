const Order = require('../models/order');
const Footfall = require('../models/footfall');
const Transaction = require('../models/transaction');
const Vendor = require('../models/vendor');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// @desc    Generate monthly report
// @route   GET /api/monthly/report/:vendorId
// @access  Private
exports.generateMonthlyReport = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { month, year, format = 'json' } = req.query;

    const vendor = await Vendor.findById(vendorId).populate('user', 'name email');
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    // Calculate date range
    const startDate = new Date(year || new Date().getFullYear(), month ? month - 1 : new Date().getMonth(), 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    // Gather all data
    const [orders, footfall, transactions] = await Promise.all([
      Order.find({
        vendor: vendorId,
        orderTime: { $gte: startDate, $lte: endDate }
      }),
      Footfall.find({
        vendor: vendorId,
        timestamp: { $gte: startDate, $lte: endDate }
      }),
      Transaction.find({
        vendor: vendorId,
        billDate: { $gte: startDate, $lte: endDate }
      })
    ]);

    // Calculate analytics
    const report = {
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        owner: vendor.user.name,
        month: startDate.toLocaleString('default', { month: 'long' }),
        year: startDate.getFullYear()
      },
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        totalFootfall: footfall.length,
        conversionRate: footfall.length > 0 ? ((orders.length / footfall.length) * 100).toFixed(2) : 0,
        averageOrderValue: orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length).toFixed(2) : 0
      },
      bestSelling: getBestSellingItems(orders),
      peakTimes: {
        peakDay: getPeakDay(orders),
        peakHour: getPeakHour(orders)
      },
      customerInsights: {
        repeatCustomers: getRepeatCustomers(orders),
        paymentMethods: getPaymentMethodDistribution(orders)
      },
      financials: calculateFinancials(orders, transactions),
      trends: {
        dailyRevenue: getDailyRevenueTrend(orders),
        weeklyPattern: getWeeklyPattern(orders)
      },
      achievements: generateAchievements(orders, footfall),
      generatedAt: new Date()
    };

    if (format === 'pdf') {
      const pdfPath = await generatePDFReport(report);
      res.download(pdfPath, `street-wrapped-${vendor.businessName}-${startDate.getMonth() + 1}-${startDate.getFullYear()}.pdf`);
    } else {
      res.status(200).json({
        success: true,
        data: report
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get shareable report link
// @route   POST /api/monthly/report/share
// @access  Private
exports.shareReport = async (req, res, next) => {
  try {
    const { vendorId, month, year, phoneNumber } = req.body;

    // Generate report
    const reportUrl = `${process.env.APP_URL}/api/monthly/report/${vendorId}?month=${month}&year=${year}&format=pdf`;
    
    // In production, integrate with WhatsApp Business API
    // For now, return the shareable link
    const shareableLink = {
      reportUrl,
      whatsappUrl: `https://wa.me/${phoneNumber}?text=Check out your Street Wrapped report for ${month}/${year}: ${reportUrl}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    res.status(200).json({
      success: true,
      data: shareableLink
    });
  } catch (err) {
    next(err);
  }
};

// Helper functions
function getBestSellingItems(orders) {
  const itemSales = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemSales[item.itemName]) {
        itemSales[item.itemName] = {
          quantity: 0,
          revenue: 0
        };
      }
      itemSales[item.itemName].quantity += item.quantity;
      itemSales[item.itemName].revenue += item.subtotal;
    });
  });

  return Object.entries(itemSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function getPeakDay(orders) {
  const dayCounts = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  orders.forEach(order => {
    const day = dayNames[new Date(order.orderTime).getDay()];
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  const peakDay = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])[0];

  return peakDay ? { day: peakDay[0], orders: peakDay[1] } : null;
}

function getPeakHour(orders) {
  const hourCounts = {};
  
  orders.forEach(order => {
    const hour = new Date(order.orderTime).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const peakHour = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])[0];

  return peakHour ? { hour: parseInt(peakHour[0]), orders: peakHour[1] } : null;
}

function getRepeatCustomers(orders) {
  const customerOrders = {};
  
  orders.forEach(order => {
    const customerId = order.customer || order.customerPhone || 'walk-in';
    customerOrders[customerId] = (customerOrders[customerId] || 0) + 1;
  });

  const repeatCustomers = Object.values(customerOrders).filter(count => count > 1).length;
  const totalCustomers = Object.keys(customerOrders).length;

  return {
    count: repeatCustomers,
    percentage: totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(2) : 0
  };
}

function getPaymentMethodDistribution(orders) {
  const methods = {};
  
  orders.forEach(order => {
    methods[order.paymentMethod] = (methods[order.paymentMethod] || 0) + 1;
  });

  return Object.entries(methods)
    .map(([method, count]) => ({
      method,
      count,
      percentage: ((count / orders.length) * 100).toFixed(2)
    }));
}

function calculateFinancials(orders, transactions) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
  
  return {
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalRevenue - totalExpenses,
    profitMargin: totalRevenue > 0 ? (((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(2) : 0
  };
}

function getDailyRevenueTrend(orders) {
  const dailyRevenue = {};
  
  orders.forEach(order => {
    const date = new Date(order.orderTime).toISOString().split('T')[0];
    dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalAmount;
  });

  return Object.entries(dailyRevenue)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getWeeklyPattern(orders) {
  const weekPattern = {
    weekdays: { orders: 0, revenue: 0 },
    weekends: { orders: 0, revenue: 0 }
  };

  orders.forEach(order => {
    const dayOfWeek = new Date(order.orderTime).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
      weekPattern.weekends.orders++;
      weekPattern.weekends.revenue += order.totalAmount;
    } else {
      weekPattern.weekdays.orders++;
      weekPattern.weekdays.revenue += order.totalAmount;
    }
  });

  return weekPattern;
}

function generateAchievements(orders, footfall) {
  const achievements = [];
  
  // Revenue milestones
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  if (totalRevenue >= 100000) achievements.push({ icon: '💰', text: 'Century Club - ₹1 Lakh+ Revenue!' });
  else if (totalRevenue >= 50000) achievements.push({ icon: '🏆', text: 'Half Century - ₹50K+ Revenue!' });
  
  // Order milestones
  if (orders.length >= 1000) achievements.push({ icon: '🎯', text: 'Order Master - 1000+ Orders!' });
  else if (orders.length >= 500) achievements.push({ icon: '⭐', text: 'Rising Star - 500+ Orders!' });
  
  // Footfall achievements
  if (footfall.length >= 5000) achievements.push({ icon: '👥', text: 'Crowd Favorite - 5000+ Visits!' });
  
  // Consistency achievements
  const dailyOrders = {};
  orders.forEach(order => {
    const date = new Date(order.orderTime).toISOString().split('T')[0];
    dailyOrders[date] = true;
  });
  
  if (Object.keys(dailyOrders).length >= 25) {
    achievements.push({ icon: '🔥', text: 'Consistent Performer - 25+ Active Days!' });
  }

  return achievements;
}

async function generatePDFReport(report) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Generate HTML content
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Street Wrapped - ${report.vendor.businessName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header h1 {
          color: #333;
          font-size: 36px;
          margin: 0;
        }
        .header .subtitle {
          color: #666;
          font-size: 18px;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #444;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        .metric {
          display: inline-block;
          margin: 10px 20px 10px 0;
        }
        .metric .value {
          font-size: 24px;
          font-weight: bold;
          color: #2196F3;
        }
        .metric .label {
          color: #666;
          font-size: 14px;
        }
        .achievement {
          background: #f0f8ff;
          padding: 15px;
          margin: 10px 0;
          border-radius: 5px;
          border-left: 4px solid #2196F3;
        }
        .best-item {
          background: #f5f5f5;
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Street Wrapped</h1>
          <div class="subtitle">${report.vendor.businessName} - ${report.vendor.month} ${report.vendor.year}</div>
        </div>
        
        <div class="section">
          <h2>Monthly Summary</h2>
          <div class="metric">
            <div class="value">₹${report.summary.totalRevenue.toLocaleString()}</div>
            <div class="label">Total Revenue</div>
          </div>
          <div class="metric">
            <div class="value">${report.summary.totalOrders}</div>
            <div class="label">Total Orders</div>
          </div>
          <div class="metric">
            <div class="value">${report.summary.totalFootfall}</div>
            <div class="label">Total Footfall</div>
          </div>
          <div class="metric">
            <div class="value">${report.summary.conversionRate}%</div>
            <div class="label">Conversion Rate</div>
          </div>
        </div>
        
        <div class="section">
          <h2>Best Selling Items</h2>
          ${report.bestSelling.map(item => `
            <div class="best-item">
              <strong>${item.name}</strong> - ${item.quantity} sold, ₹${item.revenue.toLocaleString()} revenue
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Peak Performance</h2>
          <p><strong>Best Day:</strong> ${report.peakTimes.peakDay?.day || 'N/A'} (${report.peakTimes.peakDay?.orders || 0} orders)</p>
          <p><strong>Best Hour:</strong> ${report.peakTimes.peakHour?.hour || 0}:00 - ${(report.peakTimes.peakHour?.hour || 0) + 1}:00</p>
        </div>
        
        ${report.achievements.length > 0 ? `
          <div class="section">
            <h2>Achievements Unlocked</h2>
            ${report.achievements.map(achievement => `
              <div class="achievement">
                ${achievement.icon} ${achievement.text}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="section">
          <h2>Financial Summary</h2>
          <div class="metric">
            <div class="value">₹${report.financials.profit.toLocaleString()}</div>
            <div class="label">Net Profit</div>
          </div>
          <div class="metric">
            <div class="value">${report.financials.profitMargin}%</div>
            <div class="label">Profit Margin</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  
  const pdfPath = path.join('uploads', 'reports', `report-${Date.now()}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  await browser.close();
  
  return pdfPath;
}
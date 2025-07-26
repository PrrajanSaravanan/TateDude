// ML API Endpoints Configuration
module.exports = {
  endpoints: {
    // Footfall prediction endpoints
    footfall: {
      daily: '/predict/footfall/daily',
      hourly: '/predict/footfall/hourly',
      weekly: '/predict/footfall/weekly'
    },
    
    // Demand prediction endpoints
    demand: {
      items: '/predict/items',
      category: '/predict/category',
      seasonal: '/predict/seasonal'
    },
    
    // Hygiene check endpoint
    hygiene: {
      check: '/hygiene/check',
      batch: '/hygiene/batch'
    },
    
    // Revenue prediction
    revenue: {
      daily: '/predict/revenue/daily',
      monthly: '/predict/revenue/monthly'
    }
  },
  
  // Default timeout for ML API calls
  timeout: 30000,
  
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000
  },
  
  // Model versions
  models: {
    footfall: 'v1.2',
    demand: 'v1.0',
    hygiene: 'v2.1',
    revenue: 'v1.0'
  }
};
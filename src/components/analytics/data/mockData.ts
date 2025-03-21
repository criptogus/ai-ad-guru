
// Mock data for analytics charts and insights

// Performance chart data (last 7 days)
export const performanceData = [
  { day: 'Mon', impressions: 2400, clicks: 400, conversions: 40 },
  { day: 'Tue', impressions: 1398, clicks: 300, conversions: 25 },
  { day: 'Wed', impressions: 9800, clicks: 1200, conversions: 120 },
  { day: 'Thu', impressions: 3908, clicks: 800, conversions: 90 },
  { day: 'Fri', impressions: 4800, clicks: 980, conversions: 100 },
  { day: 'Sat', impressions: 3800, clicks: 830, conversions: 75 },
  { day: 'Sun', impressions: 4300, clicks: 1100, conversions: 95 },
];

// Generate data for a 30-day period
export const generatePerformanceData = (days = 30) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayName = date.toLocaleString('en-US', { weekday: 'short' });
    const dayMonth = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}`;
    
    data.push({
      day: dayMonth,
      impressions: Math.floor(Math.random() * 10000) + 1000,
      clicks: Math.floor(Math.random() * 2000) + 200,
      conversions: Math.floor(Math.random() * 200) + 20,
    });
  }
  
  return data;
};

// Platform comparison data
export const platformComparisonData = [
  { metric: 'CTR', google: 3.2, meta: 2.7 },
  { metric: 'CPC', google: 1.5, meta: 0.8 },
  { metric: 'Conv. Rate', google: 2.8, meta: 3.5 },
  { metric: 'ROAS', google: 3.2, meta: 4.1 },
];

// Optimization data for AI insights
export const optimizationData = {
  topPerformers: [
    { id: 'c1', name: 'Summer Collection', platform: 'meta', ctr: 4.8, conversionRate: 2.7 },
    { id: 'c2', name: 'Product Launch', platform: 'google', ctr: 3.9, conversionRate: 3.1 }
  ],
  lowPerformers: [
    { id: 'c3', name: 'Winter Sale', platform: 'meta', ctr: 1.2, conversionRate: 0.5 },
    { id: 'c4', name: 'Brand Awareness', platform: 'google', ctr: 0.8, conversionRate: 0.3 }
  ],
  budgetReallocation: [
    { id: 'c1', name: 'Summer Collection', platform: 'meta', currentBudget: 100, recommendedBudget: 150 },
    { id: 'c3', name: 'Winter Sale', platform: 'meta', currentBudget: 80, recommendedBudget: 40 },
    { id: 'c2', name: 'Product Launch', platform: 'google', currentBudget: 120, recommendedBudget: 140 }
  ]
};

// Ad Health Score data
export const adHealthScores = [
  { id: 'ad1', name: 'Product Showcase', platform: 'google', score: 87, issues: [] },
  { id: 'ad2', name: 'Summer Sale Promotion', platform: 'meta', score: 64, issues: ['Low engagement rate', 'Below average CTR'] },
  { id: 'ad3', name: 'New Service Launch', platform: 'meta', score: 91, issues: [] },
  { id: 'ad4', name: 'Local Business Ads', platform: 'google', score: 45, issues: ['Poor conversion rate', 'High bounce rate', 'Low quality score'] },
];

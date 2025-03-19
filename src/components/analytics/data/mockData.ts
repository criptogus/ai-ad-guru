
// Sample performance data
export const performanceData = [
  { date: "Jul 01", impressions: 12000, clicks: 320, ctr: 2.67, conversions: 28 },
  { date: "Jul 02", impressions: 13500, clicks: 380, ctr: 2.81, conversions: 32 },
  { date: "Jul 03", impressions: 14200, clicks: 410, ctr: 2.89, conversions: 35 },
  { date: "Jul 04", impressions: 15800, clicks: 460, ctr: 2.91, conversions: 40 },
  { date: "Jul 05", impressions: 16500, clicks: 490, ctr: 2.97, conversions: 43 },
  { date: "Jul 06", impressions: 17200, clicks: 510, ctr: 2.96, conversions: 45 },
  { date: "Jul 07", impressions: 18100, clicks: 550, ctr: 3.04, conversions: 48 }
];

// Sample platform comparison data
export const platformComparisonData = [
  { platform: "Google", impressions: 85000, clicks: 2500, ctr: 2.94, conversions: 210, cost: 3200 },
  { platform: "Meta", impressions: 92000, clicks: 2800, ctr: 3.04, conversions: 240, cost: 3500 }
];

// Sample AI optimization data
export const optimizationData = {
  topPerformers: [
    { id: "1", name: "Summer Sale", platform: "google", ctr: 4.2, conversionRate: 2.1 },
    { id: "2", name: "Brand Awareness", platform: "meta", ctr: 3.8, conversionRate: 1.9 },
    { id: "3", name: "Product Launch", platform: "google", ctr: 3.5, conversionRate: 1.7 }
  ],
  lowPerformers: [
    { id: "4", name: "Holiday Special", platform: "meta", ctr: 0.8, conversionRate: 0.3 },
    { id: "5", name: "Clearance Sale", platform: "google", ctr: 0.7, conversionRate: 0.4 }
  ],
  budgetReallocation: [
    { id: "1", name: "Summer Sale", platform: "google", currentBudget: 500, recommendedBudget: 750 },
    { id: "4", name: "Holiday Special", platform: "meta", currentBudget: 400, recommendedBudget: 200 }
  ]
};

// Sample AI insights data
export const insightsData = [
  {
    category: "creative",
    title: "Ad Creative Insight",
    description: "Top performing ads mention \"Limited Time\" and show clear product images. Consider updating ad creatives to emphasize urgency and product visibility.",
    colorClass: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    category: "audience",
    title: "Audience Targeting Insight",
    description: "The 25-34 age demographic has 42% higher conversion rates. Consider reallocating budget to campaigns targeting this audience segment.",
    colorClass: "bg-green-50 dark:bg-green-900/20"
  },
  {
    category: "budget",
    title: "Budget Optimization",
    description: "Weekend campaigns show 28% higher CTR. Recommend shifting 30% of weekday budget to weekend campaigns for improved performance.",
    colorClass: "bg-amber-50 dark:bg-amber-900/20"
  }
];

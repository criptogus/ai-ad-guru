/**
 * Credit Costs
 * Defines the credit costs for various actions
 */

export const creditCosts = {
  // Ad creation costs
  'google_ads_generation': 5,  // Generate 5 Google text ad variations
  'meta_ads_generation': 5,    // Generate Instagram ad with text variations
  'linkedin_ads_generation': 5,  // Generate LinkedIn ad
  'microsoft_ads_generation': 5,  // Generate Microsoft ad variations
  'image_generation': 5,       // Generate a single ad image
  
  // AI optimization costs
  'daily_optimization': 10,    // Daily AI optimization
  'three_day_optimization': 5, // 3-day interval AI optimization
  'weekly_optimization': 2,    // Weekly AI optimization
  
  // Website analysis costs
  'website_analysis': 3,       // Analyze website for ad creation
  
  // Smart banner costs
  'banner_generation': 5,      // Create AI-generated banner
  'banner_image': 3,           // Generate image for banner
  
  // Campaign creation costs
  'campaign_creation': 5,      // Create and publish campaign
  
  // Other costs
  'advanced_targeting': 2,     // Generate AI targeting recommendations
  'performance_insights': 1    // Generate AI performance insights
};

/**
 * Credit Action Types
 */
export type CreditAction = keyof typeof creditCosts;

/**
 * Get credit cost for an action
 */
export const getCreditCost = (action: CreditAction): number => {
  return creditCosts[action] || 0;
};

/**
 * Get a formatted display of credit costs
 */
export const getCreditCostsForDisplay = (): Array<{action: string, description: string, cost: number}> => {
  return [
    { action: 'google_ads_generation', description: 'Google Search Ads (5 text variations)', cost: creditCosts.google_ads_generation },
    { action: 'meta_ads_generation', description: 'Instagram Ad (1 image + caption)', cost: creditCosts.meta_ads_generation },
    { action: 'linkedin_ads_generation', description: 'LinkedIn Ad (1 image + caption)', cost: creditCosts.linkedin_ads_generation },
    { action: 'microsoft_ads_generation', description: 'Microsoft Ads (5 text variations)', cost: creditCosts.microsoft_ads_generation },
    { action: 'image_generation', description: 'AI-Generated Ad Image', cost: creditCosts.image_generation },
    { action: 'daily_optimization', description: 'Daily AI Optimization', cost: creditCosts.daily_optimization },
    { action: 'three_day_optimization', description: '3-Day AI Optimization', cost: creditCosts.three_day_optimization },
    { action: 'weekly_optimization', description: 'Weekly AI Optimization', cost: creditCosts.weekly_optimization },
    { action: 'website_analysis', description: 'Website Analysis', cost: creditCosts.website_analysis },
    { action: 'campaign_creation', description: 'Campaign Creation', cost: creditCosts.campaign_creation }
  ];
};

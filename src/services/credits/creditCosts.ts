
/**
 * Credit Cost Configuration
 * Defines the cost of various actions in the application
 */

export interface CreditCosts {
  googleAds: number;
  metaAds: number;
  linkedInAds: number;
  microsoftAds: number;
  imageGeneration: number;
  websiteAnalysis: number;
  aiInsightsReport: number;
  adOptimization: {
    daily: number;
    every3Days: number;
    weekly: number;
  }
}

// Default credit costs for different features
const creditCosts: CreditCosts = {
  googleAds: 5,               // Cost to generate Google Ads
  metaAds: 5,                 // Cost to generate Meta Ads (including image)
  linkedInAds: 5,             // Cost to generate LinkedIn Ads
  microsoftAds: 5,            // Cost to generate Microsoft Ads
  imageGeneration: 3,         // Cost to generate a single image
  websiteAnalysis: 2,         // Cost to analyze a website
  aiInsightsReport: 10,       // Cost to generate an AI insights report
  adOptimization: {
    daily: 10,                // Cost for daily optimization
    every3Days: 5,            // Cost for optimization every 3 days
    weekly: 2                 // Cost for weekly optimization
  }
};

/**
 * Get credit cost for a specific feature
 */
export const getCreditCost = (
  feature: keyof Omit<CreditCosts, 'adOptimization'> | 
          'adOptimization.daily' | 
          'adOptimization.every3Days' | 
          'adOptimization.weekly'
): number => {
  if (feature.startsWith('adOptimization.')) {
    const optimizationType = feature.split('.')[1] as keyof typeof creditCosts.adOptimization;
    return creditCosts.adOptimization[optimizationType];
  }
  
  return creditCosts[feature as keyof Omit<CreditCosts, 'adOptimization'>];
};

/**
 * Get all credit costs
 */
export const getAllCreditCosts = (): CreditCosts => {
  return { ...creditCosts };
};

/**
 * Calculate the total cost for a campaign based on selected platforms and options
 */
export const calculateCampaignCost = (
  platforms: Array<'google' | 'meta' | 'linkedin' | 'microsoft'>,
  includeImageGeneration: boolean = false,
  includeWebsiteAnalysis: boolean = false
): number => {
  let totalCost = 0;
  
  // Add platform costs
  for (const platform of platforms) {
    switch (platform) {
      case 'google':
        totalCost += creditCosts.googleAds;
        break;
      case 'meta':
        totalCost += creditCosts.metaAds;
        break;
      case 'linkedin':
        totalCost += creditCosts.linkedInAds;
        break;
      case 'microsoft':
        totalCost += creditCosts.microsoftAds;
        break;
    }
  }
  
  // Add optional features
  if (includeImageGeneration) {
    totalCost += creditCosts.imageGeneration;
  }
  
  if (includeWebsiteAnalysis) {
    totalCost += creditCosts.websiteAnalysis;
  }
  
  return totalCost;
};

export default creditCosts;

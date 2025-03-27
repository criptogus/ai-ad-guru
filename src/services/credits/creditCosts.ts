
export type CreditAction = 
  | 'google_ads_generation'
  | 'meta_ads_generation'
  | 'linkedin_ads_generation'
  | 'microsoft_ads_generation'
  | 'image_generation'
  | 'website_analysis'
  | 'ad_optimization'
  | 'campaign_creation'
  | 'banner_creation'
  | 'smart_banner_creation'
  | 'ai_insights_report';

export interface OptimizationCosts {
  daily: number;
  every3Days: number;
  weekly: number;
}

export interface CreditCosts {
  googleAds: number;
  metaAds: number;
  linkedInAds: number;
  microsoftAds: number;
  imageGeneration: number;
  websiteAnalysis: number;
  adOptimization: OptimizationCosts;
  campaignCreation: number;
  bannerCreation: number;
  smartBanner: number;
  aiInsightsReport?: number;
}

// Create an alias for aiOptimization that points to adOptimization
Object.defineProperty(creditCosts, 'aiOptimization', {
  get: function() {
    return this.adOptimization;
  }
});

// Default credit costs
export const creditCosts: CreditCosts = {
  googleAds: 5,
  metaAds: 5,
  linkedInAds: 5,
  microsoftAds: 5,
  imageGeneration: 3,
  websiteAnalysis: 1,
  adOptimization: {
    daily: 10,
    every3Days: 5,
    weekly: 2
  },
  campaignCreation: 5,
  bannerCreation: 5,
  smartBanner: 10,
  aiInsightsReport: 3
};

// Function to get all credit costs
export const getAllCreditCosts = (): CreditCosts => {
  return creditCosts;
};

// Alias for backward compatibility
export const getCreditCosts = getAllCreditCosts;

// Function to get credit cost for a specific action
export const getCreditCost = (action: CreditAction): number | null => {
  switch (action) {
    case 'google_ads_generation':
      return creditCosts.googleAds;
    case 'meta_ads_generation':
      return creditCosts.metaAds;
    case 'linkedin_ads_generation':
      return creditCosts.linkedInAds;
    case 'microsoft_ads_generation':
      return creditCosts.microsoftAds;
    case 'image_generation':
      return creditCosts.imageGeneration;
    case 'website_analysis':
      return creditCosts.websiteAnalysis;
    case 'ad_optimization':
      return creditCosts.adOptimization.weekly; // Default to weekly
    case 'campaign_creation':
      return creditCosts.campaignCreation;
    case 'banner_creation':
      return creditCosts.bannerCreation;
    case 'smart_banner_creation':
      return creditCosts.smartBanner;
    case 'ai_insights_report':
      return creditCosts.aiInsightsReport || 3;
    default:
      return null;
  }
};

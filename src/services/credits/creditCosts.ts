
// Define cost structure 
export interface OptimizationCosts {
  daily: number;
  every3Days: number;
  weekly: number;
}

// Credit usage action type
export type CreditAction = 
  | 'google_ads_generation' 
  | 'meta_ads_generation' 
  | 'linkedin_ads_generation' 
  | 'microsoft_ads_generation' 
  | 'image_generation' 
  | 'website_analysis' 
  | 'ai_optimization_daily' 
  | 'ai_optimization_3days' 
  | 'ai_optimization_weekly' 
  | 'campaign_creation' 
  | 'smart_banner_creation'
  | 'credit_purchase'
  | 'credit_refund';

// Define credit costs for various operations
export const creditCosts = {
  googleAds: 5, // 5 credits for Google Ad generation
  metaAds: 5, // 5 credits for Meta/Instagram Ad generation
  linkedInAds: 5, // 5 credits for LinkedIn Ad generation
  microsoftAds: 5, // 5 credits for Microsoft Ad generation
  imageGeneration: 2, // 2 credits per image generation
  websiteAnalysis: 1, // 1 credit for website analysis
  adOptimization: {
    daily: 10,
    every3Days: 5,
    weekly: 2
  } as OptimizationCosts, // Credits for different optimization frequencies
  campaignCreation: 5, // 5 credits to finalize and launch a campaign
  bannerCreation: 3, // 3 credits to create a smart banner
  smartBanner: 3 // 3 credits to create a smart banner (alias for bannerCreation)
};

// Export a function to get all credit costs
export const getAllCreditCosts = () => {
  return creditCosts;
};

// Add alias for better naming
export const getCreditCosts = getAllCreditCosts;

// Export individual cost getters
export const getGoogleAdsCost = () => creditCosts.googleAds;
export const getMetaAdsCost = () => creditCosts.metaAds;
export const getLinkedInAdsCost = () => creditCosts.linkedInAds;
export const getMicrosoftAdsCost = () => creditCosts.microsoftAds;
export const getImageGenerationCost = () => creditCosts.imageGeneration;
export const getWebsiteAnalysisCost = () => creditCosts.websiteAnalysis;
export const getAdOptimizationCost = () => creditCosts.adOptimization;
export const getCampaignCreationCost = () => creditCosts.campaignCreation;
export const getBannerCreationCost = () => creditCosts.bannerCreation;

// Get credit cost by action type
export const getCreditCost = (action: CreditAction): number => {
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
    case 'ai_optimization_daily':
      return creditCosts.adOptimization.daily;
    case 'ai_optimization_3days':
      return creditCosts.adOptimization.every3Days;
    case 'ai_optimization_weekly':
      return creditCosts.adOptimization.weekly;
    case 'campaign_creation':
      return creditCosts.campaignCreation;
    case 'smart_banner_creation':
      return creditCosts.smartBanner;
    default:
      return 0;
  }
};

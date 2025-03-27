
// Define the optimization costs structure
export interface OptimizationCosts {
  daily: number;
  every3Days: number;
  weekly: number;
}

// Define credit actions
export type CreditAction = 
  | "google_ads_generation"
  | "meta_ads_generation"
  | "linkedin_ads_generation"
  | "microsoft_ads_generation"
  | "image_generation"
  | "campaign_creation"
  | "website_analysis"
  | "daily_optimization"
  | "three_day_optimization"
  | "weekly_optimization"
  | "banner_creation"
  | "smart_banner"
  | "credit_refund"
  | "ai_optimization_daily";

// Define the structure for credit costs
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
}

// Define the credit costs
const creditCostsData: CreditCosts = {
  googleAds: 5,
  metaAds: 5,
  linkedInAds: 5,
  microsoftAds: 5,
  imageGeneration: 3,
  websiteAnalysis: 2,
  adOptimization: {
    daily: 10,
    every3Days: 5,
    weekly: 2
  },
  campaignCreation: 1,
  bannerCreation: 3,
  smartBanner: 5
};

// Function to get credit costs for a specific action
export const getCreditCost = (action: CreditAction): number => {
  switch (action) {
    case "google_ads_generation":
      return creditCostsData.googleAds;
    case "meta_ads_generation":
      return creditCostsData.metaAds;
    case "linkedin_ads_generation":
      return creditCostsData.linkedInAds;
    case "microsoft_ads_generation":
      return creditCostsData.microsoftAds;
    case "image_generation":
      return creditCostsData.imageGeneration;
    case "campaign_creation":
      return creditCostsData.campaignCreation;
    case "website_analysis":
      return creditCostsData.websiteAnalysis;
    case "daily_optimization":
      return creditCostsData.adOptimization.daily;
    case "three_day_optimization":
      return creditCostsData.adOptimization.every3Days;
    case "weekly_optimization":
      return creditCostsData.adOptimization.weekly;
    case "banner_creation":
      return creditCostsData.bannerCreation;
    case "smart_banner":
      return creditCostsData.smartBanner;
    case "credit_refund":
      return 0; // Refunds don't cost credits
    case "ai_optimization_daily":
      return creditCostsData.adOptimization.daily;
    default:
      return 0;
  }
};

// Function to get all credit costs
export const getAllCreditCosts = (): CreditCosts => {
  return creditCostsData;
};

// For backward compatibility
export const getCreditCosts = getAllCreditCosts;

// For use in other modules
export { creditCostsData };


import { CreditAction, CreditCosts } from "./types";

// Define the base costs for each credit action
const BASE_COSTS: Record<CreditAction, number> = {
  googleAds: 5,
  metaAds: 5,
  linkedInAds: 6,
  microsoftAds: 5,
  imageGeneration: 5,
  websiteAnalysis: 3,
  aiInsightsReport: 7,
  "adOptimization.daily": 10,
  "adOptimization.every3Days": 5,
  "adOptimization.weekly": 2,
  campaign_creation: 10,
  image_generation: 5,
  smart_banner: 5,
  daily_optimization: 10,
};

// Function to get the credit cost for a specific action
export const getCreditCost = (action: CreditAction): number => {
  return BASE_COSTS[action] || 0;
};

// Export the full credit costs object for reference
export const CREDIT_COSTS = BASE_COSTS;

// Function to get all credit costs in a structured format
export const getAllCreditCosts = (): CreditCosts => {
  return {
    googleAds: BASE_COSTS.googleAds,
    metaAds: BASE_COSTS.metaAds,
    linkedInAds: BASE_COSTS.linkedInAds,
    microsoftAds: BASE_COSTS.microsoftAds,
    imageGeneration: BASE_COSTS.imageGeneration,
    websiteAnalysis: BASE_COSTS.websiteAnalysis,
    aiInsightsReport: BASE_COSTS.aiInsightsReport,
    adOptimization: {
      daily: BASE_COSTS["adOptimization.daily"],
      every3Days: BASE_COSTS["adOptimization.every3Days"],
      weekly: BASE_COSTS["adOptimization.weekly"]
    },
    campaign_creation: BASE_COSTS.campaign_creation,
    image_generation: BASE_COSTS.image_generation,
    smart_banner: BASE_COSTS.smart_banner,
    daily_optimization: BASE_COSTS.daily_optimization
  };
};

export default BASE_COSTS;

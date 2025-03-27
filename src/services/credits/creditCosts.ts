
import { CreditAction } from "./types";

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

export default BASE_COSTS;

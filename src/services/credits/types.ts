
/**
 * Credit action types
 */
export type CreditAction = 
  | 'googleAds' 
  | 'metaAds' 
  | 'linkedInAds'
  | 'microsoftAds'
  | 'imageGeneration'
  | 'websiteAnalysis'
  | 'aiInsightsReport'
  | 'adOptimization.daily'
  | 'adOptimization.every3Days'
  | 'adOptimization.weekly'
  | 'campaign_creation'
  | 'image_generation'
  | 'smart_banner';

/**
 * Credit cost structure
 */
export interface CreditCosts {
  campaignCreation: number;
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
  };
}

/**
 * Credit transaction structure
 */
export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'add' | 'consume';
  description: string;
  created_at: string;
}

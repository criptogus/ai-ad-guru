
/**
 * Credit action types
 */
export type CreditAction = 
  | 'campaign_creation' 
  | 'ad_optimization' 
  | 'image_generation'
  | 'ad_testing'
  | 'audience_analysis';

/**
 * Credit cost structure
 */
export interface CreditCosts {
  campaignCreation: number;
  imageGeneration: number;
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

/**
 * Credit action types supported by the platform
 */
export type CreditAction =
  // Ad creation
  | 'googleAds'
  | 'metaAds'
  | 'linkedinAds'
  | 'microsoftAds'
  
  // Image generation
  | 'imageGeneration'
  | 'smartBanner'
  
  // AI optimization
  | 'adOptimization.daily'
  | 'adOptimization.weekly'
  | 'adOptimization.monthly'
  
  // Other actions
  | 'campaignAnalysis'
  | 'websiteAnalysis'
  | 'exportReport'
  
  // Purchases
  | 'creditPurchase';

/**
 * Credit transaction types
 */
export type CreditTransactionType = 'debit' | 'credit';

/**
 * Credit transaction interface
 */
export interface CreditTransaction {
  id: string;
  userId: string;
  action: CreditAction;
  amount: number;
  description: string;
  type: CreditTransactionType;
  timestamp: string;
  metadata?: Record<string, any>;
}


/**
 * Credit action types
 */
export type CreditAction = 
  | 'textAd' 
  | 'imageAd' 
  | 'googleAds' 
  | 'metaAds' 
  | 'linkedInAds' 
  | 'microsoftAds' 
  | 'siteAnalysis'
  | 'audienceAnalysis'
  | 'imageGeneration'
  | 'smartBanner'
  | 'adOptimization.daily'
  | 'adOptimization.weekly'
  | 'adOptimization.monthly'
  | 'campaignOptimizationDaily'
  | 'campaignOptimizationWeekly'
  | 'campaignOptimizationMonthly';

/**
 * Credit checks result type
 */
export interface CreditCheckResult {
  hasEnough: boolean;
  required: number;
  current: number;
  deficit: number;
}

/**
 * Credit transaction type for ledger entries
 */
export interface CreditTransaction {
  id: string;
  userId: string;
  change: number;
  reason: string;
  refId?: string;
  createdAt: string;
}

/**
 * Credit transaction type enumeration
 */
export type CreditTransactionType = 'purchase' | 'usage' | 'refund' | 'welcome';

/**
 * Credit usage history entry
 */
export interface CreditUsage {
  id: string;
  userId: string;
  amount: number;
  action: CreditAction;
  description: string;
  timestamp: string;
}

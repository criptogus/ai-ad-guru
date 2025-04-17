
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

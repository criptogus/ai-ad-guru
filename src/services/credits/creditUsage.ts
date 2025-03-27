
/**
 * Credit Usage Service
 * Handles credit usage and verification
 */

import { errorLogger } from '@/services/libs/error-handling';
import { getUserCredits, useCredits, hasEnoughCredits } from './creditsApi';
import { CreditAction } from './types';
import { creditCosts } from './creditCosts';

export interface CreditUsageResult {
  success: boolean;
  remainingCredits?: number;
  error?: string;
}

/**
 * Use credits for a specific action with error handling
 */
export const useCreditWithErrorHandling = async (
  userId: string,
  action: CreditAction,
  description: string,
  metadata?: Record<string, any>
): Promise<CreditUsageResult> => {
  try {
    // First check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, action);
    
    if (!hasCredits) {
      const cost = creditCosts[action] || 0;
      return {
        success: false,
        error: `Insufficient credits. This action requires ${cost} credits.`
      };
    }
    
    // Use credits
    const success = await useCredits(userId, action, description, metadata);
    
    if (!success) {
      return {
        success: false,
        error: "Failed to use credits. Please try again."
      };
    }
    
    // Get remaining credits
    const remainingCredits = await getUserCredits(userId);
    
    return {
      success: true,
      remainingCredits
    };
  } catch (error) {
    errorLogger.logError(error, 'useCreditWithErrorHandling');
    
    return {
      success: false,
      error: error.message || "An error occurred while processing credits."
    };
  }
};

/**
 * Calculate total credit cost for a set of actions
 */
export const calculateTotalCreditCost = (actions: CreditAction[]): number => {
  return actions.reduce((total, action) => {
    return total + (creditCosts[action] || 0);
  }, 0);
};

/**
 * Check if user has enough credits for multiple actions
 */
export const hasEnoughCreditsForActions = async (userId: string, actions: CreditAction[]): Promise<boolean> => {
  try {
    const totalCost = calculateTotalCreditCost(actions);
    
    if (totalCost <= 0) {
      return true; // No credits needed
    }
    
    // Get user's current credit balance
    const userCredits = await getUserCredits(userId);
    
    return userCredits >= totalCost;
  } catch (error) {
    errorLogger.logError(error, 'hasEnoughCreditsForActions');
    return false;
  }
};

/**
 * Consume credits for a given action (alias for useCredits with simpler interface)
 * This function is used by components that expect a simpler API
 */
export const consumeCredits = async (
  userId: string,
  amount: number,
  action: CreditAction,
  description: string
): Promise<boolean> => {
  try {
    return await useCredits(userId, action, description);
  } catch (error) {
    errorLogger.logError(error, 'consumeCredits');
    return false;
  }
};

/**
 * Credits API Service
 * Handles credit-related API requests
 */

import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';
import { CreditAction } from './types';
import { creditCosts } from './creditCosts';

export interface CreditTransaction {
  id: string;
  userId: string;
  action: string;
  amount: number;
  description: string;
  createdAt: string;
  campaignId?: string;
  platformId?: string;
}

/**
 * Get user's current credit balance
 */
export const getUserCredits = async (userId: string): Promise<number> => {
  try {
    // Query user profile for credits
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.credits || 0;
  } catch (error) {
    errorLogger.logError(error, 'getUserCredits');
    return 0;
  }
};

/**
 * Get credit transaction history for a user
 */
export const getCreditTransactions = async (userId: string): Promise<CreditTransaction[]> => {
  try {
    // Query credit transactions for user
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      action: item.action,
      amount: item.amount,
      description: item.description,
      createdAt: item.created_at,
      campaignId: item.campaign_id,
      platformId: item.platform_id
    })) || [];
  } catch (error) {
    errorLogger.logError(error, 'getCreditTransactions');
    return [];
  }
};

/**
 * Add credits to a user's account
 */
export const addCredits = async (userId: string, amount: number, description: string): Promise<boolean> => {
  try {
    // Start a transaction
    const { data, error } = await supabase.rpc('add_credits', {
      user_id: userId,
      credit_amount: amount,
      tx_description: description
    });
    
    if (error) {
      throw error;
    }
    
    return data || false;
  } catch (error) {
    errorLogger.logError(error, 'addCredits');
    return false;
  }
};

/**
 * Use credits for an action
 */
export const useCredits = async (
  userId: string, 
  action: CreditAction, 
  description: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    // Get cost for this action
    const creditCost = creditCosts[action] || 0;
    
    if (creditCost <= 0) {
      return true; // No credits needed for this action
    }
    
    // Use credits
    const { data, error } = await supabase.rpc('use_credits', {
      user_id: userId,
      credit_amount: creditCost,
      tx_action: action,
      tx_description: description,
      campaign_id: metadata?.campaignId,
      platform_id: metadata?.platformId
    });
    
    if (error) {
      throw error;
    }
    
    return data || false;
  } catch (error) {
    errorLogger.logError(error, 'useCredits');
    return false;
  }
};

/**
 * Check if user has enough credits for an action
 */
export const hasEnoughCredits = async (userId: string, action: CreditAction): Promise<boolean> => {
  try {
    // Get cost for this action
    const creditCost = creditCosts[action] || 0;
    
    if (creditCost <= 0) {
      return true; // No credits needed for this action
    }
    
    // Get user's current credit balance
    const userCredits = await getUserCredits(userId);
    
    return userCredits >= creditCost;
  } catch (error) {
    errorLogger.logError(error, 'hasEnoughCredits');
    return false;
  }
};

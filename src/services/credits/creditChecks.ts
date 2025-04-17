
import { supabase } from '@/integrations/supabase/client';
import { getCreditCost } from './creditCosts';
import { CreditAction, CreditCheckResult } from './types';

/**
 * Check if a user has enough credits for an action
 */
export const checkUserCredits = async (
  userId: string, 
  action: CreditAction,
  quantity: number = 1
): Promise<CreditCheckResult> => {
  try {
    // Get the credit cost for the action
    const requiredCredits = getCreditCost(action) * quantity;
    
    // Get user's current credit balance
    const { data: balance, error } = await supabase
      .from('credit_balance')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking user credits:', error);
      throw error;
    }
    
    const currentCredits = balance?.balance || 0;
    const hasEnough = currentCredits >= requiredCredits;
    
    return {
      hasEnough,
      required: requiredCredits,
      current: currentCredits,
      deficit: hasEnough ? 0 : requiredCredits - currentCredits
    };
  } catch (error) {
    console.error('Error in checkUserCredits:', error);
    // Return a default failed result
    return {
      hasEnough: false,
      required: getCreditCost(action) * quantity,
      current: 0,
      deficit: getCreditCost(action) * quantity
    };
  }
};

/**
 * Deduct credits from user's account
 */
export const deductUserCredits = async (
  userId: string,
  action: CreditAction,
  reason: string,
  refId?: string,
  quantity: number = 1
): Promise<boolean> => {
  try {
    // Get the credit cost for the action
    const creditCost = getCreditCost(action) * quantity;
    
    if (creditCost <= 0) {
      return true; // No credits needed for this action
    }
    
    // Check if user has enough credits
    const { hasEnough } = await checkUserCredits(userId, action, quantity);
    
    if (!hasEnough) {
      return false;
    }
    
    // Deduct credits from user account
    const { error } = await supabase
      .from('credit_ledger')
      .insert({
        user_id: userId,
        change: -creditCost,
        reason: action,
        ref_id: refId || reason
      });
    
    if (error) {
      console.error('Error deducting user credits:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deductUserCredits:', error);
    return false;
  }
};

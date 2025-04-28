
import { supabase } from '@/integrations/supabase/client';
import { CreditAction, CreditCheckResult } from './types';
import { recordCreditTransaction } from './transactions';
import { getCreditCost } from './creditCosts';
import { toast } from 'sonner';

/**
 * Check if a user has enough credits for an action
 */
export const checkUserCredits = async (
  userId: string,
  action: CreditAction
): Promise<CreditCheckResult> => {
  try {
    if (!userId) {
      throw new Error("User ID is required to check credits");
    }
    
    // Validate userId format (basic check)
    if (typeof userId !== 'string' || userId.length < 5) {
      throw new Error("Invalid user ID format");
    }
    
    console.log(`Checking credits for user ${userId} for action ${action}`);
    
    // Get current credit balance
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error("Error fetching user profile:", userError);
      throw new Error(`Failed to fetch user profile: ${userError.message}`);
    }
    
    if (!userData) {
      console.error("User profile not found");
      throw new Error("User profile not found");
    }
    
    const currentCredits = userData.credits || 0;
    const requiredCredits = getCreditCost(action);
    const hasEnough = currentCredits >= requiredCredits;
    const deficit = hasEnough ? 0 : requiredCredits - currentCredits;
    
    console.log(`Credit check result: current=${currentCredits}, required=${requiredCredits}, hasEnough=${hasEnough}`);
    
    return {
      hasEnough,
      required: requiredCredits,
      current: currentCredits,
      deficit
    };
  } catch (error) {
    console.error('Error checking user credits:', error);
    throw new Error(`Failed to check credit balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Alternative credit check for easier integration
 */
export const checkCreditSufficiency = async (
  userId: string,
  action: CreditAction
): Promise<boolean> => {
  try {
    const check = await checkUserCredits(userId, action);
    return check.hasEnough;
  } catch (error) {
    console.error("Error in checkCreditSufficiency:", error);
    return false;
  }
};

/**
 * Consume credits for an action
 */
export const consumeCredits = async (
  userId: string,
  action: CreditAction,
  creditAmount: number,
  description: string
): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("Attempt to consume credits with no user ID");
      throw new Error("User ID is required to consume credits");
    }
    
    console.log(`Attempting to consume ${creditAmount} credits for user ${userId}, action: ${action}`);
    
    // Check if user has enough credits
    const { hasEnough, current } = await checkUserCredits(userId, action);
    
    if (!hasEnough) {
      console.error(`User ${userId} has insufficient credits: ${current} < ${creditAmount}`);
      toast.error('Insufficient credits', {
        description: `You need more credits to perform this action.`
      });
      return false;
    }
    
    // Update user's credit balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        credits: current - creditAmount
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating user credits:", updateError);
      throw new Error(`Failed to update user credits: ${updateError.message}`);
    }
    
    // Record credit usage in the ledger
    const { error: ledgerError } = await supabase
      .from('credit_ledger')
      .insert([{
        user_id: userId,
        change: -creditAmount,
        reason: action,
        ref_id: description
      }]);
    
    if (ledgerError) {
      console.error("Error recording credit transaction:", ledgerError);
      // This is not fatal since the balance was already updated
      console.warn(`Credit ledger entry failed but balance was updated. User: ${userId}, Amount: ${creditAmount}`);
    } else {
      console.log(`Successfully recorded credit transaction for user ${userId}`);
    }
    
    console.log(`Successfully consumed ${creditAmount} credits for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error consuming credits:', error);
    toast.error('Failed to consume credits', {
      description: error instanceof Error ? error.message : 'An unknown error occurred'
    });
    throw new Error(`Failed to consume credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Add credits to a user's account
 */
export const addCredits = async (
  userId: string, 
  amount: number, 
  reason: string
): Promise<boolean> => {
  try {
    if (!userId) {
      throw new Error("User ID is required to add credits");
    }
    
    // Get current credit balance
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error("Error fetching user profile for adding credits:", userError);
      throw new Error(`Failed to fetch user profile: ${userError.message}`);
    }
    
    const currentCredits = userData?.credits || 0;
    
    // Update user's credit balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        credits: currentCredits + amount
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error adding credits:", updateError);
      throw new Error(`Failed to add credits: ${updateError.message}`);
    }
    
    // Record credit transaction in the ledger
    const { error: ledgerError } = await supabase
      .from('credit_ledger')
      .insert([{
        user_id: userId,
        change: amount,
        reason: 'purchase',
        ref_id: reason
      }]);
    
    if (ledgerError) {
      console.error("Error recording credit addition:", ledgerError);
      console.warn(`Credits were added but ledger entry failed. User: ${userId}, Amount: ${amount}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding credits:', error);
    throw new Error(`Failed to add credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a user's credit balance
 */
export const getUserCreditBalance = async (userId: string): Promise<number> => {
  try {
    if (!userId) {
      throw new Error("User ID is required to get credit balance");
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error getting user credit balance:", error);
      throw error;
    }
    
    return data?.credits || 0;
  } catch (error) {
    console.error('Error getting user credit balance:', error);
    return 0;
  }
};

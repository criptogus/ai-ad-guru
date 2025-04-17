
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
    // Get current credit balance
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (userError) throw userError;
    
    const currentCredits = userData?.credits || 0;
    const requiredCredits = getCreditCost(action);
    const hasEnough = currentCredits >= requiredCredits;
    const deficit = hasEnough ? 0 : requiredCredits - currentCredits;
    
    return {
      hasEnough,
      required: requiredCredits,
      current: currentCredits,
      deficit
    };
  } catch (error) {
    console.error('Error checking user credits:', error);
    return {
      hasEnough: false,
      required: 0,
      current: 0,
      deficit: 0
    };
  }
};

/**
 * Alternative credit check for easier integration
 */
export const checkCreditSufficiency = async (
  userId: string,
  action: CreditAction
): Promise<boolean> => {
  const check = await checkUserCredits(userId, action);
  return check.hasEnough;
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
    // Check if user has enough credits
    const { hasEnough, current } = await checkUserCredits(userId, action);
    
    if (!hasEnough) {
      toast.error('Insufficient credits', {
        description: `You need more credits to perform this action.`
      });
      return false;
    }
    
    // Update user's credit balance
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        credits: current - creditAmount
      })
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    // Record credit usage
    await supabase
      .from('credit_usage')
      .insert([{
        user_id: userId,
        amount: creditAmount,
        action,
        description
      }]);
    
    // Record credit transaction
    await recordCreditTransaction(
      userId,
      -creditAmount,
      'usage',
      description
    );
    
    return true;
  } catch (error) {
    console.error('Error consuming credits:', error);
    toast.error('Failed to consume credits');
    return false;
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
    // Get current credit balance
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (userError) throw userError;
    
    const currentCredits = userData?.credits || 0;
    
    // Update user's credit balance
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        credits: currentCredits + amount
      })
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    // Record credit transaction
    await recordCreditTransaction(
      userId,
      amount,
      'purchase',
      reason
    );
    
    return true;
  } catch (error) {
    console.error('Error adding credits:', error);
    return false;
  }
};

/**
 * Get a user's credit balance
 */
export const getUserCreditBalance = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.credits || 0;
  } catch (error) {
    console.error('Error getting user credit balance:', error);
    return 0;
  }
};

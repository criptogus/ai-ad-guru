
import { supabase } from '@/integrations/supabase/client';
import { CreditAction } from './types';
import { getCreditCost } from './creditCosts';
import { errorLogger } from '@/services/libs/error-handling';
import { v4 as uuidv4 } from 'uuid';

/**
 * Consume credits for a specific action
 */
export const consumeCredits = async (
  userId: string,
  amount: number,
  action: CreditAction,
  description: string
): Promise<boolean> => {
  try {
    if (!userId) {
      console.error('User ID is required to consume credits');
      return false;
    }
    
    // Get current user credits
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user credits:', userError);
      return false;
    }
    
    const currentCredits = user?.credits || 0;
    
    // Check if user has enough credits
    if (currentCredits < amount) {
      return false;
    }
    
    // Start a transaction to update credits and log the transaction
    const { error: transactionError } = await supabase.rpc('consume_credits', {
      user_id: userId,
      credit_amount: amount,
      action_type: action,
      action_description: description
    });
    
    if (transactionError) {
      console.error('Error consuming credits:', transactionError);
      return false;
    }
    
    return true;
  } catch (error) {
    errorLogger.logError(error, 'consumeCredits');
    return false;
  }
};

/**
 * Add credits to a user account
 */
export const addCredits = async (
  userId: string,
  amount: number,
  description: string
): Promise<boolean> => {
  try {
    // Get current user credits
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user credits:', userError);
      return false;
    }
    
    const currentCredits = user?.credits || 0;
    const newCredits = currentCredits + amount;
    
    // Update user credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating credits:', updateError);
      return false;
    }
    
    // Log credit transaction
    const { error: logError } = await supabase
      .from('credit_transactions')
      .insert({
        id: uuidv4(),
        user_id: userId,
        amount: -amount, // Negative because it's a credit (adding to balance)
        action: 'creditPurchase',
        description: description,
        created_at: new Date().toISOString()
      });
    
    if (logError) {
      console.error('Error logging credit transaction:', logError);
      // Don't return false here since the credits were already added
    }
    
    return true;
  } catch (error) {
    errorLogger.logError(error, 'addCredits');
    return false;
  }
};

/**
 * Check if user has enough credits for an action
 */
export const checkCreditSufficiency = async (
  userId: string,
  action: CreditAction
): Promise<boolean> => {
  try {
    const cost = getCreditCost(action);
    
    // Get current user credits
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user credits:', userError);
      return false;
    }
    
    const currentCredits = user?.credits || 0;
    return currentCredits >= cost;
  } catch (error) {
    errorLogger.logError(error, 'checkCreditSufficiency');
    return false;
  }
};

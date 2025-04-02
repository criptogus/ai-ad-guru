
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

/**
 * Get full credit history for a user
 */
export const getUserCreditHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    errorLogger.logError(error, 'getUserCreditHistory');
    return [];
  }
};

/**
 * Get credit usage summary
 */
export const getCreditUsageSummary = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_credit_usage_summary', { user_id: userId });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    errorLogger.logError(error, 'getCreditUsageSummary');
    return [];
  }
};

/**
 * Get user's credit balance history
 */
export const getCreditBalanceHistory = async (userId: string, days: number = 30) => {
  try {
    const { data, error } = await supabase
      .rpc('get_credit_balance_history', { user_id: userId, days_back: days });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    errorLogger.logError(error, 'getCreditBalanceHistory');
    return [];
  }
};

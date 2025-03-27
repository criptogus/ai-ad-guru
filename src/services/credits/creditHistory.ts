
/**
 * Credit History Service
 * Handles retrieving credit usage history
 */

import { supabase } from '@/services/libs/supabase-client';
import { errorLogger } from '@/services/libs/error-handling';

export interface CreditUsage {
  id: string;
  userId: string;
  action: string;
  amount: number;
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

/**
 * Get credit usage history for a user
 */
export const getCreditUsageHistory = async (userId: string): Promise<CreditUsage[]> => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
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
      metadata: item.metadata
    }));
  } catch (error) {
    errorLogger.logError(error, 'getCreditUsageHistory');
    return [];
  }
};

/**
 * Get summary of credit usage for analytics
 */
export const getCreditUsageSummary = async (userId: string): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .rpc('get_credit_usage_summary', { user_id: userId });
    
    if (error) {
      throw error;
    }
    
    // Convert the array format to a dictionary
    const summary: Record<string, number> = {};
    
    if (Array.isArray(data)) {
      data.forEach(item => {
        summary[item.action] = item.total;
      });
    }
    
    return summary;
  } catch (error) {
    errorLogger.logError(error, 'getCreditUsageSummary');
    return {};
  }
};

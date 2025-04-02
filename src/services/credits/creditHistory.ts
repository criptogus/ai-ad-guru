
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

export interface CreditUsage {
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
 * Get credit usage history for a user
 */
export const getCreditUsageHistory = async (userId: string): Promise<CreditUsage[]> => {
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
    errorLogger.logError(error, 'getCreditUsageHistory');
    return [];
  }
};

/**
 * Get credit usage summary for a user
 */
export const getCreditUsageSummary = async (userId: string): Promise<Record<string, number>> => {
  try {
    // Query credit usage summary
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('action, amount')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    // Aggregate usage by action
    const summary: Record<string, number> = {};
    data.forEach(item => {
      const action = item.action;
      if (!summary[action]) {
        summary[action] = 0;
      }
      summary[action] += Math.abs(item.amount);
    });
    
    return summary;
  } catch (error) {
    errorLogger.logError(error, 'getCreditUsageSummary');
    return {};
  }
};

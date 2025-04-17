
import { supabase } from '@/integrations/supabase/client';
import { CreditTransaction, CreditTransactionType } from './types';

/**
 * Records a credit transaction
 */
export const recordCreditTransaction = async (
  userId: string,
  change: number,
  type: CreditTransactionType,
  reason: string,
  refId?: string
): Promise<CreditTransaction | null> => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .insert([{
        user_id: userId,
        change,
        type,
        reason,
        ref_id: refId
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      change: data.change,
      reason: data.reason,
      refId: data.ref_id,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error recording credit transaction:', error);
    return null;
  }
};

/**
 * Gets credit transactions for a user
 */
export const getCreditTransactions = async (
  userId: string,
  limit = 50,
  offset = 0
): Promise<CreditTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return data.map(transaction => ({
      id: transaction.id,
      userId: transaction.user_id,
      change: transaction.change,
      reason: transaction.reason,
      refId: transaction.ref_id,
      createdAt: transaction.created_at
    }));
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    return [];
  }
};

/**
 * Gets a user's credit usage history
 */
export const getUserCreditHistory = async (userId: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('credit_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(usage => ({
      id: usage.id,
      userId: usage.user_id,
      amount: usage.amount,
      action: usage.action,
      description: usage.description,
      timestamp: usage.created_at
    }));
  } catch (error) {
    console.error('Error fetching credit usage history:', error);
    return [];
  }
};

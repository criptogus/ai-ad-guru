
import { supabase } from '@/integrations/supabase/client';
import { CreditAction } from './types';

/**
 * Credits Service API
 * This service encapsulates all credits-related operations
 */
export const creditsApi = {
  /**
   * Get user credits
   */
  getUserCredits: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data?.credits || 0;
  },
  
  /**
   * Add credits to user
   */
  addCredits: async (userId: string, amount: number, reason: string) => {
    // First get current credits
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentCredits = profile?.credits || 0;
    const newCreditAmount = currentCredits + amount;
    
    // Update credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCreditAmount })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    
    // Log credit transaction
    await this.logCreditTransaction(userId, amount, 'add', reason);
    
    return newCreditAmount;
  },
  
  /**
   * Consume credits
   */
  consumeCredits: async (userId: string, amount: number, action: CreditAction, details: string) => {
    // First get current credits
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentCredits = profile?.credits || 0;
    
    // Check if user has enough credits
    if (currentCredits < amount) {
      return false;
    }
    
    const newCreditAmount = currentCredits - amount;
    
    // Update credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCreditAmount })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    
    // Log credit transaction
    await this.logCreditTransaction(userId, amount, 'consume', `${action}: ${details}`);
    
    return true;
  },
  
  /**
   * Log credit transaction
   */
  logCreditTransaction: async (
    userId: string, 
    amount: number, 
    type: 'add' | 'consume', 
    description: string
  ) => {
    const { error } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount,
        type,
        description
      });
      
    if (error) {
      console.error('Error logging credit transaction:', error);
    }
  },
  
  /**
   * Get credit usage history
   */
  getCreditUsageHistory: async (userId: string) => {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
};

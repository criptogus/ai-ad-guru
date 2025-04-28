
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreditTransaction {
  userId: string;
  amount: number;
  action: string;
  metadata?: Record<string, any>;
}

export interface CreditCheck {
  hasEnough: boolean;
  required: number;
  current: number;
  deficit: number;
}

export class CreditTransactionManager {
  static async checkCredits(userId: string, requiredAmount: number): Promise<CreditCheck> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();
      
      const currentCredits = profile?.credits || 0;
      const hasEnough = currentCredits >= requiredAmount;
      
      return {
        hasEnough,
        required: requiredAmount,
        current: currentCredits,
        deficit: hasEnough ? 0 : requiredAmount - currentCredits
      };
    } catch (error) {
      console.error('Error checking credits:', error);
      throw new Error('Failed to verify credit balance');
    }
  }

  static async deductCredits(transaction: CreditTransaction): Promise<boolean> {
    try {
      console.log(`Deducting ${transaction.amount} credits for ${transaction.action}`);
      
      const { data: result, error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: transaction.userId,
          change: -transaction.amount,
          reason: transaction.action,
          ref_id: transaction.metadata?.refId || transaction.action
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Credit deduction successful:', result);
      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      throw new Error('Failed to deduct credits');
    }
  }

  static async refundCredits(transaction: CreditTransaction): Promise<boolean> {
    try {
      console.log(`Refunding ${transaction.amount} credits for failed ${transaction.action}`);
      
      const { data: result, error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: transaction.userId,
          change: transaction.amount,
          reason: `refund_${transaction.action}`,
          ref_id: transaction.metadata?.refId || `refund_${transaction.action}`
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Credit refund successful:', result);
      toast.success('Credits refunded', {
        description: `${transaction.amount} credits have been refunded due to operation failure.`
      });
      
      return true;
    } catch (error) {
      console.error('Error refunding credits:', error);
      throw new Error('Failed to refund credits');
    }
  }
}

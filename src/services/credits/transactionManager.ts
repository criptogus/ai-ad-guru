
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorLogger } from '@/services/libs/error-handling';

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
      console.log(`Checking credits for user ${userId}, required: ${requiredAmount}`);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile for credit check:', error);
        errorLogger.logError({ 
          message: error.message, 
          details: error.details,
          code: error.code 
        }, 'CreditTransactionManager.checkCredits');
        throw new Error(`Failed to verify credit balance: ${error.message}`);
      }
      
      if (!profile) {
        console.error('No profile found for user', userId);
        errorLogger.logError({ message: 'User profile not found' }, 'CreditTransactionManager.checkCredits');
        throw new Error('User profile not found');
      }
      
      const currentCredits = profile.credits || 0;
      const hasEnough = currentCredits >= requiredAmount;
      const deficit = hasEnough ? 0 : requiredAmount - currentCredits;
      
      console.log(`Credit check result: current=${currentCredits}, required=${requiredAmount}, hasEnough=${hasEnough}, deficit=${deficit}`);
      
      return {
        hasEnough,
        required: requiredAmount,
        current: currentCredits,
        deficit
      };
    } catch (error) {
      console.error('Error checking credits:', error);
      errorLogger.logError(error, 'CreditTransactionManager.checkCredits');
      throw new Error(`Failed to verify credit balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deductCredits(transaction: CreditTransaction): Promise<boolean> {
    try {
      if (!transaction.userId) {
        const missingFieldError = new Error('Missing required field: userId');
        errorLogger.logError(missingFieldError, 'CreditTransactionManager.deductCredits');
        throw missingFieldError;
      }

      if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
        const invalidAmountError = new Error(`Invalid credit amount: ${transaction.amount}`);
        errorLogger.logError(invalidAmountError, 'CreditTransactionManager.deductCredits');
        throw invalidAmountError;
      }
      
      console.log(`Deducting ${transaction.amount} credits for ${transaction.action} (user: ${transaction.userId})`);
      
      // First update the profiles table to reduce the credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', transaction.userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        errorLogger.logError({ 
          message: profileError.message, 
          details: profileError.details,
          code: profileError.code,
          hint: profileError.hint
        }, 'CreditTransactionManager.deductCredits.fetchProfile');
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }
      
      if (!profile) {
        const noProfileError = new Error(`No profile found for user: ${transaction.userId}`);
        errorLogger.logError(noProfileError, 'CreditTransactionManager.deductCredits');
        throw noProfileError;
      }
      
      const currentCredits = profile.credits || 0;
      if (currentCredits < transaction.amount) {
        const insufficientError = new Error(`Insufficient credits: ${currentCredits} < ${transaction.amount}`);
        errorLogger.logError(insufficientError, 'CreditTransactionManager.deductCredits');
        throw insufficientError;
      }
      
      // Update the user's credit balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          credits: currentCredits - transaction.amount
        })
        .eq('id', transaction.userId);
      
      if (updateError) {
        console.error('Error updating user credit balance:', updateError);
        errorLogger.logError({ 
          message: updateError.message, 
          details: updateError.details,
          code: updateError.code,
          hint: updateError.hint,
          operation: 'credit_balance_update'
        }, 'CreditTransactionManager.deductCredits.updateBalance');
        throw new Error(`Failed to update credit balance: ${updateError.message}`);
      }
      
      // Now record the transaction in the ledger
      const { data: result, error: ledgerError } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: transaction.userId,
          change: -transaction.amount,
          reason: transaction.action,
          ref_id: transaction.metadata?.refId || transaction.action
        })
        .select()
        .single();

      if (ledgerError) {
        console.error('Error inserting credit ledger entry:', ledgerError);
        
        // This is critical - attempt to rollback by adding the credits back
        try {
          await supabase
            .from('profiles')
            .update({
              credits: currentCredits
            })
            .eq('id', transaction.userId);
          
          errorLogger.logWarning('Credits were rolled back after ledger entry failed', 
            'CreditTransactionManager.deductCredits.rollback');
        } catch (rollbackError) {
          console.error('Critical error: Failed to rollback credits after ledger failure:', rollbackError);
          errorLogger.logError({ 
            message: 'Failed to rollback credits', 
            originalError: ledgerError,
            rollbackError
          }, 'CreditTransactionManager.deductCredits.rollbackFailed');
        }
        
        errorLogger.logError({ 
          message: ledgerError.message, 
          details: ledgerError.details,
          code: ledgerError.code,
          hint: ledgerError.hint,
          operation: 'ledger_insert'
        }, 'CreditTransactionManager.deductCredits.insertLedger');
        throw new Error(`Failed to record credit transaction: ${ledgerError.message}`);
      }
      
      console.log('Credit deduction successful:', result);
      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      
      // Enhance error logging with more context
      let errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        context: {
          userId: transaction.userId,
          amount: transaction.amount,
          action: transaction.action
        }
      };
      
      errorLogger.logError(errorDetails, 'CreditTransactionManager.deductCredits');
      
      // Rethrow with better details
      throw new Error(`Failed to deduct credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async refundCredits(transaction: CreditTransaction): Promise<boolean> {
    try {
      console.log(`Refunding ${transaction.amount} credits for failed ${transaction.action} (user: ${transaction.userId})`);
      
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

      if (error) {
        console.error('Error inserting refund credit ledger entry:', error);
        errorLogger.logError({ 
          message: error.message, 
          details: error.details,
          code: error.code,
          operation: 'refund_insert'
        }, 'CreditTransactionManager.refundCredits');
        throw error;
      }
      
      console.log('Credit refund successful:', result);
      toast.success('Credits refunded', {
        description: `${transaction.amount} credits have been refunded due to operation failure.`
      });
      
      return true;
    } catch (error) {
      console.error('Error refunding credits:', error);
      errorLogger.logError(error, 'CreditTransactionManager.refundCredits');
      throw new Error(`Failed to refund credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

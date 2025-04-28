
/**
 * Credit Transaction Manager
 * Provides utilities for managing credit transactions with enhanced error handling
 */

import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

export interface CreditTransaction {
  userId: string;
  amount: number;
  action: string;
  metadata?: Record<string, any>;
}

export class CreditTransactionManager {
  /**
   * Check if user has enough credits for an operation
   */
  static async checkCredits(userId: string, requiredAmount: number): Promise<{hasEnough: boolean; current: number}> {
    try {
      console.log(`[CreditManager] Checking if user ${userId} has ${requiredAmount} credits`);
      
      // Get current credit balance from materialized view
      const { data, error } = await supabase
        .from('credit_balance')
        .select('total_credits')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('[CreditManager] Error checking credit balance:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'check_credits'
        }, 'CreditTransactionManager.checkCredits');
        
        throw new Error(`Failed to check credit balance: ${error.message}`);
      }
      
      // If no data returned, user has no credits
      const currentBalance = data ? data.total_credits : 0;
      const hasEnough = currentBalance >= requiredAmount;
      
      console.log(`[CreditManager] User ${userId} has ${currentBalance} credits, needs ${requiredAmount}, hasEnough: ${hasEnough}`);
      
      return {
        hasEnough,
        current: currentBalance
      };
    } catch (error) {
      console.error('[CreditManager] Error in checkCredits:', error);
      errorLogger.logError(error, 'CreditTransactionManager.checkCredits');
      throw error;
    }
  }
  
  /**
   * Deduct credits from user account with enhanced error handling
   */
  static async deductCredits(transaction: CreditTransaction): Promise<boolean> {
    try {
      console.log(`[CreditManager] Deducting ${transaction.amount} credits from user ${transaction.userId} for ${transaction.action}`);
      
      // Credit deductions are stored as negative values
      const deductionAmount = -Math.abs(transaction.amount);
      
      // Insert the transaction record
      const { error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: transaction.userId,
          change: deductionAmount,
          reason: transaction.action,
          metadata: transaction.metadata || {}
        });
      
      if (error) {
        console.error('[CreditManager] Error deducting credits:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'deduct_credits',
          transaction
        }, 'CreditTransactionManager.deductCredits');
        
        throw new Error(`Failed to deduct credits: ${error.message}`);
      }
      
      console.log(`[CreditManager] Successfully deducted ${transaction.amount} credits from user ${transaction.userId}`);
      return true;
    } catch (error) {
      console.error('[CreditManager] Error in deductCredits:', error);
      errorLogger.logError(error, 'CreditTransactionManager.deductCredits');
      throw error;
    }
  }
  
  /**
   * Refund credits to user account (for example, if an operation fails after credits were deducted)
   */
  static async refundCredits(transaction: CreditTransaction): Promise<boolean> {
    try {
      console.log(`[CreditManager] Refunding ${transaction.amount} credits to user ${transaction.userId} for ${transaction.action}`);
      
      // Credit refunds are stored as positive values
      const refundAmount = Math.abs(transaction.amount);
      
      // Insert the refund transaction record
      const { error } = await supabase
        .from('credit_ledger')
        .insert({
          user_id: transaction.userId,
          change: refundAmount,
          reason: transaction.action,
          metadata: transaction.metadata || {}
        });
      
      if (error) {
        console.error('[CreditManager] Error refunding credits:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'refund_credits',
          transaction
        }, 'CreditTransactionManager.refundCredits');
        
        throw new Error(`Failed to refund credits: ${error.message}`);
      }
      
      console.log(`[CreditManager] Successfully refunded ${transaction.amount} credits to user ${transaction.userId}`);
      return true;
    } catch (error) {
      console.error('[CreditManager] Error in refundCredits:', error);
      errorLogger.logError(error, 'CreditTransactionManager.refundCredits');
      throw error;
    }
  }
}

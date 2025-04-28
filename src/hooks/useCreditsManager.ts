
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import { toast as sonnerToast } from 'sonner';
import { errorLogger } from '@/services/libs/error-handling';
import { CreditTransactionManager } from '@/services/credits/transactionManager';

export const useCreditsManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshCredits } = useCredits();

  // Detailed credit balance check
  const checkCreditBalance = useCallback(async (requiredCredits: number) => {
    if (!user?.id) {
      const authError = new Error('Attempted to check credits without authenticated user');
      errorLogger.logError(authError, 'useCreditsManager.checkCreditBalance');
      
      toast({
        title: "Authentication required",
        description: "You need to be logged in to continue",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log(`Checking credit balance for user ${user.id}, required credits: ${requiredCredits}`);
      
      // Use the enhanced credit check functionality from TransactionManager
      const creditCheck = await CreditTransactionManager.checkCredits(user.id, requiredCredits);
      return creditCheck.hasEnough;
    } catch (error) {
      console.error('Unexpected error checking credit balance:', error);
      errorLogger.logError({
        error,
        user_id: user.id,
        requiredCredits,
        operation: "credit_balance_check"
      }, 'useCreditsManager.checkCreditBalance');
      
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to check credits: ${error.message}`
          : "An unexpected error occurred while checking your credits",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Credit consumption with detailed logging and better error handling
  const consumeCredits = useCallback(async (amount: number, reason: string, refId?: string) => {
    if (!user?.id) {
      const authError = new Error('Attempted to consume credits without authenticated user');
      errorLogger.logError(authError, 'useCreditsManager.consumeCredits');
      
      toast({
        title: "Authentication required",
        description: "You need to be logged in to continue",
        variant: "destructive",
      });
      return false;
    }

    console.log(`Attempting to consume ${amount} credits for: ${reason}, user: ${user.id}`);
    
    // Validate credit amount
    if (amount <= 0) {
      const invalidAmountError = new Error(`Invalid credit amount: ${amount}`);
      errorLogger.logError(invalidAmountError, 'useCreditsManager.consumeCredits');
      return false;
    }
    
    // Check balance before proceeding
    const hasEnough = await checkCreditBalance(amount);
    if (!hasEnough) {
      console.error(`Insufficient credits: required ${amount}`);
      toast({
        title: "Insufficient credits",
        description: `You need ${amount} credits for this operation.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Use the TransactionManager for more robust credit deduction
      const result = await CreditTransactionManager.deductCredits({
        userId: user.id,
        amount: amount,
        action: reason,
        metadata: { refId: refId || reason }
      });
      
      // Update balance in context
      await refreshCredits();
      
      console.log(`Successfully consumed ${amount} credits for: ${reason}`);
      sonnerToast.success(`${amount} credits used`, {
        description: reason
      });
      
      return true;
    } catch (error) {
      console.error('Error consuming credits:', error);
      
      // Enhanced error logging with detailed context
      errorLogger.logError({
        message: error instanceof Error ? error.message : 'Unknown error',
        context: {
          userId: user.id,
          amount,
          reason,
          refId
        },
        operation: 'credit_consumption'
      }, 'useCreditsManager.consumeCredits');
      
      // Display user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message.includes('Failed to') ? error.message : `Failed to consume credits: ${error.message}`
        : "Failed to consume credits. Please try again.";
      
      toast({
        title: "Credit Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [user, toast, checkCreditBalance, refreshCredits]);

  // Get credit cost for a specific action
  const getActionCreditCost = useCallback((action: string): number => {
    const creditCosts = {
      'website_analysis': 2,
      'ad_generation_per_platform': 5,
      'campaign_publication': 10,
      'audience_analysis': 3,
      'ad_optimization': 5,
      'image_generation': 5,
    };
    
    console.log(`Credit cost for ${action}: ${creditCosts[action as keyof typeof creditCosts] || 0}`);
    return creditCosts[action as keyof typeof creditCosts] || 0;
  }, []);

  // Get transaction history
  const getCreditTransactions = useCallback(async (limit = 10) => {
    if (!user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('credit_ledger')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching credit history:', error);
        errorLogger.logError({
          message: error.message,
          details: error.details,
          code: error.code,
          operation: 'fetch_transaction_history'
        }, 'useCreditsManager.getCreditTransactions');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching history:', error);
      errorLogger.logError(error, 'useCreditsManager.getCreditTransactions');
      return [];
    }
  }, [user]);

  return {
    checkCreditBalance,
    consumeCredits,
    getActionCreditCost,
    getCreditTransactions
  };
};

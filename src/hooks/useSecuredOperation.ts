
import { useState } from 'react';
import { CreditTransactionManager, CreditTransaction } from '@/services/credits/transactionManager';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SecuredOperationOptions {
  action: string;
  requiredCredits: number;
  metadata?: Record<string, any>;
}

export function useSecuredOperation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const executeSecured = async <T>(
    operation: () => Promise<T>,
    options: SecuredOperationOptions
  ): Promise<T | null> => {
    if (!user?.id) {
      toast.error('Authentication required');
      return null;
    }

    setIsProcessing(true);
    
    try {
      // Check credit balance
      const creditCheck = await CreditTransactionManager.checkCredits(
        user.id,
        options.requiredCredits
      );

      if (!creditCheck.hasEnough) {
        toast.error('Insufficient credits', {
          description: `You need ${creditCheck.deficit} more credits to perform this action.`
        });
        return null;
      }

      // Prepare transaction
      const transaction: CreditTransaction = {
        userId: user.id,
        amount: options.requiredCredits,
        action: options.action,
        metadata: options.metadata
      };

      // Deduct credits before operation
      await CreditTransactionManager.deductCredits(transaction);

      // Execute the operation
      const result = await operation();
      return result;
    } catch (error) {
      console.error(`Error in secured operation (${options.action}):`, error);
      
      // If operation fails, attempt to refund
      if (user?.id) {
        try {
          await CreditTransactionManager.refundCredits({
            userId: user.id,
            amount: options.requiredCredits,
            action: options.action,
            metadata: options.metadata
          });
        } catch (refundError) {
          console.error('Error refunding credits:', refundError);
        }
      }

      toast.error('Operation failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    executeSecured,
    isProcessing
  };
}

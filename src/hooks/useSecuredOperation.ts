
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
      console.error('Authentication required for secured operation');
      toast.error('Authentication required');
      return null;
    }

    console.log(`Starting secured operation: ${options.action}, required credits: ${options.requiredCredits}`);
    setIsProcessing(true);
    
    try {
      // Check credit balance
      console.log(`Checking credit balance for user ${user.id}`);
      const creditCheck = await CreditTransactionManager.checkCredits(
        user.id,
        options.requiredCredits
      );
      console.log('Credit check result:', creditCheck);

      if (!creditCheck.hasEnough) {
        console.error(`Insufficient credits: needed ${options.requiredCredits}, has ${creditCheck.current}`);
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
      console.log(`Deducting ${options.requiredCredits} credits for ${options.action}`);
      await CreditTransactionManager.deductCredits(transaction);
      console.log('Credits deducted successfully');

      // Execute the operation
      console.log(`Executing operation: ${options.action}`);
      const result = await operation();
      console.log(`Operation ${options.action} completed successfully`, result ? 'with result' : 'but result is null/undefined');
      return result;
    } catch (error) {
      console.error(`Error in secured operation (${options.action}):`, error);
      
      // If operation fails, attempt to refund
      if (user?.id) {
        try {
          console.log(`Attempting to refund ${options.requiredCredits} credits due to operation failure`);
          await CreditTransactionManager.refundCredits({
            userId: user.id,
            amount: options.requiredCredits,
            action: options.action,
            metadata: options.metadata
          });
          console.log('Credits refunded successfully');
        } catch (refundError) {
          console.error('Error refunding credits:', refundError);
        }
      }

      toast.error('Operation failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      
      throw error;
    } finally {
      console.log(`Secured operation ${options.action} processing completed`);
      setIsProcessing(false);
    }
  };

  return {
    executeSecured,
    isProcessing
  };
}

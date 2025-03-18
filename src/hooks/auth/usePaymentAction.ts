
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updatePaymentStatus } from '@/services/auth';
import { CustomUser } from '@/types/auth';

export const usePaymentAction = (
  user: CustomUser | null, 
  setUser: (user: CustomUser | null) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateUserPaymentStatus = async (hasPaid: boolean): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update the profile in the database
      await updatePaymentStatus(user.id, hasPaid);
      
      // Update the user in local state
      const updatedUser = { ...user, hasPaid };
      setUser(updatedUser);
      
      toast({
        title: hasPaid ? "Subscription activated" : "Subscription cancelled",
        description: hasPaid ? "Your account has been upgraded." : "Your subscription has been cancelled.",
      });
      
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Failed to update subscription',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateSuccessfulPayment = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      // Update the user's payment status to paid
      await updateUserPaymentStatus(true);
      
      toast({
        title: "Test subscription activated",
        description: "You've simulated a successful payment for testing purposes.",
      });
      
    } catch (error: any) {
      console.error('Error simulating payment:', error);
      toast({
        title: 'Failed to simulate payment',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    isLoading
  };
};

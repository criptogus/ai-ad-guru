
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentVerification = (sessionId: string | null) => {
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;
      
      setVerifying(true);
      setError(null);
      
      try {
        const response = await supabase.functions.invoke('verify-credit-purchase', {
          body: { sessionId }
        });
        
        if (response.error) {
          throw new Error(response.error.message || 'Payment verification failed');
        }
        
        const data = response.data;
        
        if (!data.success) {
          setError(data.message || 'Payment was not completed successfully');
          return;
        }
        
        // Payment was successful
        setSuccess(true);
        setCreditAmount(data.creditAmount || 0);
        
        toast({
          title: 'Payment Successful!',
          description: `${data.creditAmount} credits have been added to your account.`,
        });
      } catch (err: any) {
        console.error('Payment verification error:', err);
        setError(err.message || 'Failed to verify payment');
        
        toast({
          title: 'Payment Verification Failed',
          description: err.message || 'There was an error verifying your payment.',
          variant: 'destructive',
        });
      } finally {
        setVerifying(false);
      }
    };
    
    if (sessionId && user) {
      verifyPayment();
    }
  }, [sessionId, user, toast]);
  
  return {
    verifying,
    success,
    error,
    creditAmount
  };
};

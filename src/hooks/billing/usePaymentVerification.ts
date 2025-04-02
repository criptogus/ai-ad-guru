
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentVerificationResult {
  verifying: boolean;
  success: boolean;
  error: string | null;
}

export const usePaymentVerification = (sessionId: string | null): PaymentVerificationResult => {
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        setVerifying(true);
        console.log('Verifying payment with session ID:', sessionId);

        // Call the verify-payment edge function
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error) {
          console.error('Error verifying payment:', error);
          setError(error.message || 'Failed to verify payment');
          toast.error('Payment verification failed');
          return;
        }

        if (data?.success) {
          console.log('Payment verified successfully:', data);

          // Update the user's profile with payment status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ has_paid: true })
            .eq('id', data.userId);

          if (updateError) {
            console.error('Error updating profile payment status:', updateError);
          }

          setSuccess(true);
          toast.success('Payment successful!');
          
          // UPDATED: Redirect to campaign creation after successful payment
          setTimeout(() => {
            navigate('/campaign/create', { replace: true });
          }, 2000);
        } else {
          setError(data?.message || 'Payment verification returned unsuccessful');
          toast.error('Payment verification failed');
        }
      } catch (err: any) {
        console.error('Exception in payment verification:', err);
        setError(err.message || 'An unexpected error occurred');
        toast.error('Payment verification failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  return { verifying, success, error };
};

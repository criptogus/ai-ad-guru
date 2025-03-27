
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentVerification = (sessionId?: string | null) => {
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!sessionId) return;
    
    const verifySession = async () => {
      try {
        setVerifying(true);
        
        const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
          body: { sessionId }
        });
        
        if (error) {
          console.error("Error verifying checkout session:", error);
          setError("Failed to verify payment. Please contact support.");
          return;
        }
        
        if (data?.status === 'complete') {
          setSuccess(true);
        } else {
          setError(`Payment status: ${data?.status || 'unknown'}`);
        }
      } catch (err) {
        console.error("Error in payment verification:", err);
        setError("An unexpected error occurred. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };
    
    verifySession();
  }, [sessionId]);
  
  return { verifying, success, error };
};

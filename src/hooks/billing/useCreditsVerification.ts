
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/contexts/CreditsContext';

export const useCreditsVerification = () => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { refreshCredits } = useCredits();

  useEffect(() => {
    const verifyPendingPurchase = async () => {
      try {
        const storedPurchaseIntent = localStorage.getItem('credit_purchase_intent');
        
        if (!storedPurchaseIntent) {
          return;
        }
        
        const purchaseData = JSON.parse(storedPurchaseIntent);
        const { sessionId, timestamp } = purchaseData;
        
        // Skip if no session ID or if timestamp is older than 24 hours
        if (!sessionId || Date.now() - timestamp > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('credit_purchase_intent');
          return;
        }
        
        setProcessing(true);
        
        // Call verify-payment function
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });
        
        if (error) {
          console.error('Error verifying payment:', error);
          return;
        }
        
        if (data?.verified) {
          setSuccess(true);
          await refreshCredits();
          localStorage.removeItem('credit_purchase_intent');
        }
      } catch (err) {
        console.error('Error in credit verification:', err);
      } finally {
        setProcessing(false);
      }
    };

    verifyPendingPurchase();
  }, [refreshCredits]);

  return {
    processing,
    success
  };
};

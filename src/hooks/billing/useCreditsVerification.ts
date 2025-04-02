
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCreditsVerification = () => {
  const [processing, setProcessing] = useState(false);
  const [verified, setVerified] = useState(false);
  const { user, setUser } = useAuth();
  
  useEffect(() => {
    const storedPurchaseIntent = localStorage.getItem('credit_purchase_intent');
    
    if (storedPurchaseIntent && user) {
      const verifyPurchase = async () => {
        try {
          setProcessing(true);
          
          // Get the stored purchase intent
          const purchaseIntent = JSON.parse(storedPurchaseIntent);
          const { amount, timestamp, sessionId } = purchaseIntent;
          
          // Check if the purchase is recent (within 24 hours)
          const now = Date.now();
          const isRecent = now - timestamp < 24 * 60 * 60 * 1000;
          
          if (!isRecent) {
            console.log("Purchase intent is too old - ignoring");
            localStorage.removeItem('credit_purchase_intent');
            setProcessing(false);
            return;
          }
          
          // Verify the purchase with the server
          const { data, error } = await supabase.functions.invoke('verify-credit-purchase', {
            body: { sessionId }
          });
          
          if (error) {
            console.error("Error verifying checkout session:", error);
            toast.error("Failed to verify credit purchase");
            setProcessing(false);
            return;
          }
          
          if (data?.success) {
            console.log(`Adding ${amount} credits to user ${user.id}`);
            
            // Update local user state
            if (setUser && user) {
              setUser({
                ...user,
                credits: (user.credits || 0) + amount
              });
            }
            
            toast.success(`${amount} credits have been added to your account!`);
            setVerified(true);
            
            // Clear the purchase intent
            localStorage.removeItem('credit_purchase_intent');
          } else {
            // If payment is pending or unsuccessful
            console.log("Payment verification status:", data?.message || "Unknown");
            if (data?.paymentStatus === 'unpaid') {
              toast.error("Payment incomplete. Please complete your payment to receive credits.");
            }
          }
        } catch (error) {
          console.error("Error processing credit verification:", error);
          toast.error("Error verifying your purchase");
        } finally {
          setProcessing(false);
        }
      };
      
      verifyPurchase();
    }
  }, [user, setUser]);
  
  return { processing, verified };
};

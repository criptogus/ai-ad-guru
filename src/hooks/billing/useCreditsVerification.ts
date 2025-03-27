
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCreditsVerification = () => {
  const [processing, setProcessing] = useState(false);
  const [verified, setVerified] = useState(false);
  const { user } = useAuth();
  
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
          const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
            body: { sessionId }
          });
          
          if (error) {
            console.error("Error verifying checkout session:", error);
            setProcessing(false);
            return;
          }
          
          if (data?.status === 'complete') {
            console.log(`Adding ${amount} credits to user ${user.id}`);
            
            // Add credits to the user
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                credits: (user.credits || 0) + amount 
              })
              .eq('id', user.id);
            
            if (updateError) {
              console.error("Error updating user credits:", updateError);
            } else {
              try {
                // Add credit usage record
                await supabase.from('credit_usage').insert({
                  user_id: user.id,
                  amount: -amount, // Negative means credits added
                  action: 'credit_purchase',
                  description: `Purchased ${amount} credits`,
                });
                
                setVerified(true);
                
                // Clear the purchase intent
                localStorage.removeItem('credit_purchase_intent');
                
                // Reload the page to refresh user data
                window.location.reload();
              } catch (err) {
                console.error("Error logging credit purchase:", err);
              }
            }
          }
        } catch (error) {
          console.error("Error processing credit verification:", error);
        } finally {
          setProcessing(false);
        }
      };
      
      verifyPurchase();
    }
  }, [user]);
  
  return { processing, verified };
};

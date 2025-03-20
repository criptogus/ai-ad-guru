
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addCredits } from "@/services/credits";
import { supabase } from "@/integrations/supabase/client";

export const useCreditsVerification = () => {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    // Check if there's a pending credit purchase in localStorage
    const storedPurchaseIntent = localStorage.getItem('credit_purchase_intent');
    if (!storedPurchaseIntent) return;
    
    const processPurchase = async () => {
      try {
        setProcessing(true);
        
        // Parse the stored purchase intent
        const purchaseIntent = JSON.parse(storedPurchaseIntent);
        
        // Call Supabase edge function to verify the payment
        const { data, error } = await supabase.functions.invoke("verify-credit-purchase", {
          body: { 
            userId: purchaseIntent.userId,
            timestamp: purchaseIntent.timestamp,
            amount: purchaseIntent.amount,
            price: purchaseIntent.price,
            stripeLink: purchaseIntent.stripeLink
          }
        });
        
        if (error) {
          throw new Error(`Payment verification failed: ${error.message}`);
        }
        
        if (data?.verified) {
          // Add the credits to the user's account
          const success = await addCredits(
            purchaseIntent.userId, 
            purchaseIntent.amount, 
            `Purchased ${purchaseIntent.amount} credits for $${purchaseIntent.price}`
          );
          
          if (success) {
            toast({
              title: "Credits Purchase Successful!",
              description: `${purchaseIntent.amount} credits have been added to your account.`,
            });
          }
        } else {
          console.log("Payment not verified:", data);
          // Don't show an error message here - the payment might still be processing
        }
        
        // Clear the stored purchase intent regardless of outcome to prevent multiple processing
        localStorage.removeItem('credit_purchase_intent');
      } catch (error) {
        console.error("Error processing credit purchase:", error);
        toast({
          title: "Error Processing Purchase",
          description: "There was an error processing your credit purchase. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
    };
    
    processPurchase();
  }, [toast]);
  
  return { processing };
};

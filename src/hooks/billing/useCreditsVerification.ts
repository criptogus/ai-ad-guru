
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { addCredits } from "@/services/credits";

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
        
        // Verify the purchase (in a real app, this should be done on the server)
        // For now, we'll simulate a successful purchase
        const purchaseTime = new Date(purchaseIntent.timestamp);
        const currentTime = new Date();
        const timeDifferenceMinutes = (currentTime.getTime() - purchaseTime.getTime()) / 1000 / 60;
        
        // Only process the purchase if it was made within the last 10 minutes
        // This is to prevent double processing if the user refreshes the page
        if (timeDifferenceMinutes <= 10) {
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

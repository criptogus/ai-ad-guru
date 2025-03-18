
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentVerification = (sessionId: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUserPaymentStatus } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<boolean>(!!sessionId);

  useEffect(() => {
    if (!sessionId) return;
    
    console.log('Found session_id in URL, beginning verification:', sessionId);
    
    const verifyPayment = async () => {
      try {
        setVerifying(true);
        console.log('Calling verify-payment function with session ID:', sessionId);
        
        // Call the edge function to verify the payment
        const { data, error: functionError } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });

        if (functionError) {
          console.error('Verification error from edge function:', functionError);
          throw new Error(functionError.message || "Error verifying payment");
        }

        console.log('Verification response received:', data);

        if (data?.verified) {
          console.log('Payment verified successfully');
          // Update local state
          updateUserPaymentStatus(true);
          toast({
            title: "Payment successful!",
            description: "Your subscription has been activated.",
          });
          // Clear the session ID from the URL to prevent re-verification on page refresh
          window.history.replaceState({}, document.title, "/billing");
          // Navigate after a short delay to ensure state updates are processed
          setTimeout(() => navigate("/dashboard"), 1000);
        } else if (data) {
          console.log('Payment pending or incomplete:', data);
          toast({
            title: "Payment pending",
            description: "Your payment is being processed. We'll update your account when it's complete.",
            variant: "default",
          });
          // Clear the session ID from the URL
          window.history.replaceState({}, document.title, "/billing");
          // Navigate to dashboard after a delay
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          throw new Error("Invalid response from verification service");
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        setError(error.message || "There was a problem verifying your payment");
        toast({
          title: "Error activating subscription",
          description: "There was a problem verifying your payment. Please contact support.",
          variant: "destructive",
        });
        // Clear the session ID from the URL
        window.history.replaceState({}, document.title, "/billing");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, toast, updateUserPaymentStatus]);

  return { error, verifying };
};


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

interface PaymentVerificationProps {
  sessionId: string | null;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ sessionId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUserPaymentStatus } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    
    console.log('Found session_id in URL, beginning verification:', sessionId);
    
    const verifyPayment = async () => {
      try {
        console.log('Calling verify-payment function with session ID:', sessionId);
        
        // Call the edge function to verify the payment
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });

        if (error) {
          console.error('Verification error from edge function:', error);
          throw new Error(error.message || "Error verifying payment");
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
          setTimeout(() => navigate("/dashboard"), 800);
        } else if (data) {
          console.log('Payment pending or incomplete:', data);
          toast({
            title: "Payment pending",
            description: "Your payment is being processed. We'll update your account when it's complete.",
            variant: "default",
          });
          // Clear the session ID from the URL
          window.history.replaceState({}, document.title, "/billing");
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
      }
    };

    verifyPayment();
  }, [sessionId, navigate, toast, updateUserPaymentStatus]);

  if (!sessionId) return null;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Payment</h1>
          <p className="text-gray-600">Please wait while we confirm your subscription...</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentVerification;

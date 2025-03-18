
import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { usePaymentVerification } from "@/hooks/billing/usePaymentVerification";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaymentVerificationProps {
  sessionId: string | null;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ sessionId }) => {
  const { verifying, error } = usePaymentVerification(sessionId);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verificationTimeout, setVerificationTimeout] = useState(false);
  
  useEffect(() => {
    if (!sessionId) return;
    
    // Log that we're starting verification
    console.log(`Payment verification started with session ID: ${sessionId}`);
    
    // Set a timeout as a fallback in case verification takes too long
    const timeoutId = setTimeout(() => {
      if (verifying) {
        console.log("Verification timeout triggered");
        setVerificationTimeout(true);
        toast({
          title: "Verification taking longer than expected",
          description: "We're still processing your payment. You'll be notified when it's complete.",
          variant: "default",
        });
      }
    }, 20000);
    
    return () => clearTimeout(timeoutId);
  }, [sessionId, verifying, toast]);

  if (!sessionId) {
    return null;
  }

  const handleReturnToBilling = () => {
    window.history.replaceState({}, document.title, "/billing");
    navigate("/billing");
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          {verifying && !verificationTimeout && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-brand-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Payment</h1>
              <p className="text-gray-600 mb-4">Please wait while we confirm your subscription...</p>
            </>
          )}
          
          {verificationTimeout && (
            <>
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification In Progress</h1>
              <p className="text-gray-600 mb-4">
                Your payment verification is taking longer than expected. We'll continue processing 
                it in the background and update your account when it's complete.
              </p>
              <Button onClick={handleReturnToBilling} className="mt-4">
                Return to Billing
              </Button>
            </>
          )}
          
          {error && !verifying && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h1>
              <p className="text-gray-600 mb-4">
                We encountered an issue while activating your subscription. Please try again or contact support.
              </p>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <Button onClick={handleReturnToBilling} className="mt-4">
                Return to Billing
              </Button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentVerification;

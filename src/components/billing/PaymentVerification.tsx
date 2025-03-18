
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { usePaymentVerification } from "@/hooks/billing/usePaymentVerification";
import { useToast } from "@/hooks/use-toast";

interface PaymentVerificationProps {
  sessionId: string | null;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ sessionId }) => {
  const { verifying, error } = usePaymentVerification(sessionId);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!sessionId) return;
    
    // Log that we're starting verification
    console.log(`Payment verification started with session ID: ${sessionId}`);
    
    // Set a timeout as a fallback in case verification doesn't complete
    const timeoutId = setTimeout(() => {
      if (verifying) {
        console.log("Verification timeout triggered");
        toast({
          title: "Verification taking longer than expected",
          description: "We're still processing your payment. You'll be notified when it's complete.",
          variant: "default",
        });
      }
    }, 20000);
    
    return () => clearTimeout(timeoutId);
  }, [sessionId, verifying, toast]);

  if (!sessionId || !verifying) return null;

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

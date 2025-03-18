
import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Bug } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { usePaymentVerification } from "@/hooks/billing/usePaymentVerification";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface PaymentVerificationProps {
  sessionId?: string | null;
  verifying?: boolean;
  success?: boolean;
  error?: string | null;
  debug?: any;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ 
  sessionId, 
  verifying = false, 
  success = false, 
  error = null,
  debug = null
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verificationTimeout, setVerificationTimeout] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
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
    }, 15000);
    
    return () => clearTimeout(timeoutId);
  }, [sessionId, verifying, toast]);

  const handleReturnToBilling = () => {
    window.history.replaceState({}, document.title, "/billing");
    navigate("/billing");
  };

  const handleTryAgain = () => {
    // Reload the page to retry verification
    window.location.reload();
  };

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  if (!sessionId) {
    return null;
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          {verifying && !verificationTimeout && !success && !error && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-brand-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Payment</h1>
              <p className="text-gray-600 mb-4">Please wait while we confirm your subscription...</p>
              <p className="text-xs text-gray-400">Session ID: {sessionId.substring(0, 10)}...</p>
            </>
          )}
          
          {success && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated</h1>
              <p className="text-gray-600 mb-4">
                Your payment was successful and your subscription has been activated!
              </p>
              <Button onClick={() => navigate("/dashboard")} className="mt-4">
                Go to Dashboard
              </Button>
            </>
          )}
          
          {verificationTimeout && !success && !error && (
            <>
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification In Progress</h1>
              <p className="text-gray-600 mb-4">
                Your payment verification is taking longer than expected. We'll continue processing 
                it in the background and update your account when it's complete.
              </p>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                <Button onClick={handleTryAgain} variant="outline" className="mt-4">
                  Try Again
                </Button>
                <Button onClick={handleReturnToBilling} className="mt-4">
                  Return to Billing
                </Button>
              </div>
            </>
          )}
          
          {error && !verifying && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h1>
              <p className="text-gray-600 mb-4">
                We encountered an issue while activating your subscription. Please try again or contact support.
              </p>
              <Alert variant="destructive" className="mb-4 text-left">
                <AlertTitle>Error details</AlertTitle>
                <AlertDescription className="text-sm font-mono">{error}</AlertDescription>
              </Alert>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                <Button onClick={handleTryAgain} variant="outline" className="mt-4">
                  Try Again
                </Button>
                <Button onClick={handleReturnToBilling} className="mt-4">
                  Return to Billing
                </Button>
              </div>
            </>
          )}
          
          {debug && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDebug} 
                className="text-xs mb-2"
              >
                {showDebug ? "Hide Debug Info" : "Show Debug Info"}
              </Button>
              
              {showDebug && (
                <div className="bg-gray-100 p-3 rounded text-left overflow-auto max-h-40 text-xs font-mono">
                  <p>Session ID: {sessionId}</p>
                  <p>Status: {verifying ? "Verifying" : success ? "Success" : "Failed"}</p>
                  {debug && (
                    <>
                      <p className="font-semibold mt-2">Debug info:</p>
                      <pre>{JSON.stringify(debug, null, 2)}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <button 
            onClick={toggleDebug}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center"
          >
            <Bug className="h-3 w-3 mr-1" />
            {showDebug ? "Hide Technical Info" : "Show Technical Info"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentVerification;

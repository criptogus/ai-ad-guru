
import { useState, useEffect, useRef } from "react";
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
  const [success, setSuccess] = useState<boolean>(false);
  const [retries, setRetries] = useState(0);
  const [debug, setDebug] = useState<any>(null);
  const MAX_RETRIES = 3;
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  // Clear timeout on unmount
  const timeoutRef = useRef<number | null>(null);

  // Cleanup function for useEffect
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    
    console.log('Found session_id in URL, beginning verification:', sessionId);
    
    const verifyPayment = async () => {
      try {
        if (!isMounted.current) return;
        
        setVerifying(true);
        console.log('Calling verify-payment function with session ID:', sessionId);
        
        // Try first a direct verification with test mode
        if (sessionId.startsWith('cs_test_')) {
          console.log('Test session detected, trying direct verification mode first');
          
          const directResult = await supabase.functions.invoke("verify-payment", {
            body: { 
              sessionId,
              direct: true 
            },
          });
          
          console.log('Direct verification result:', directResult);
          
          if (!isMounted.current) return;
          
          setDebug(directResult);
          
          if (directResult.data?.verified) {
            console.log('Direct verification successful');
            setSuccess(true);
            updateUserPaymentStatus(true);
            toast({
              title: "Payment successful!",
              description: "Your subscription has been activated.",
            });
            window.history.replaceState({}, document.title, "/billing");
            timeoutRef.current = window.setTimeout(() => {
              if (isMounted.current) {
                navigate("/dashboard");
              }
            }, 1500);
            return;
          } else {
            console.log('Direct verification not successful, falling back to standard verification');
          }
        }
        
        // Call the edge function to verify the payment
        const { data, error: functionError } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });

        console.log('Verification response:', { data, error: functionError });
        
        if (!isMounted.current) return;
        
        setDebug({ data, error: functionError });

        if (functionError) {
          console.error('Verification error from edge function:', functionError);
          
          // If we haven't exceeded max retries, try again
          if (retries < MAX_RETRIES) {
            console.log(`Retry attempt ${retries + 1} of ${MAX_RETRIES}`);
            setRetries(prev => prev + 1);
            
            // Wait before retrying with exponential backoff
            const retryDelay = Math.min(3000 * Math.pow(1.5, retries), 10000);
            
            timeoutRef.current = window.setTimeout(() => {
              if (isMounted.current) {
                verifyPayment();
              }
            }, retryDelay);
            return;
          }
          
          throw new Error(functionError.message || "Error verifying payment");
        }

        console.log('Verification response received:', data);

        if (data?.verified) {
          console.log('Payment verified successfully');
          // Update local state
          setSuccess(true);
          updateUserPaymentStatus(true);
          toast({
            title: "Payment successful!",
            description: "Your subscription has been activated.",
          });
          // Clear the session ID from the URL to prevent re-verification on page refresh
          window.history.replaceState({}, document.title, "/billing");
          // Navigate after a short delay to ensure state updates are processed
          timeoutRef.current = window.setTimeout(() => {
            if (isMounted.current) {
              navigate("/dashboard");
            }
          }, 1500);
        } else if (data?.session?.payment_status === 'unpaid' || data?.session?.status === 'open') {
          console.log('Payment pending or incomplete:', data);
          
          // If we haven't exceeded max retries, try again
          if (retries < MAX_RETRIES) {
            console.log(`Payment not yet confirmed. Retry attempt ${retries + 1} of ${MAX_RETRIES}`);
            setRetries(prev => prev + 1);
            
            // Wait before retrying with exponential backoff
            const retryDelay = Math.min(5000 * Math.pow(1.5, retries), 15000);
            
            timeoutRef.current = window.setTimeout(() => {
              if (isMounted.current) {
                verifyPayment();
              }
            }, retryDelay);
            return;
          }
          
          toast({
            title: "Payment pending",
            description: "Your payment is being processed. We'll update your account when it's complete.",
            variant: "default",
          });
          // Clear the session ID from the URL
          window.history.replaceState({}, document.title, "/billing");
          // Navigate to billing after a delay
          timeoutRef.current = window.setTimeout(() => {
            if (isMounted.current) {
              navigate("/billing");
            }
          }, 1500);
        } else {
          // If we haven't exceeded max retries, try again
          if (retries < MAX_RETRIES) {
            console.log(`Payment not yet confirmed. Retry attempt ${retries + 1} of ${MAX_RETRIES}`);
            setRetries(prev => prev + 1);
            
            // Wait before retrying with exponential backoff
            const retryDelay = Math.min(3000 * Math.pow(1.5, retries), 10000);
            
            timeoutRef.current = window.setTimeout(() => {
              if (isMounted.current) {
                verifyPayment();
              }
            }, retryDelay);
            return;
          }
          
          throw new Error("Payment verification incomplete. Please contact support if your subscription is not activated.");
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        
        if (!isMounted.current) return;
        
        setError(error.message || "There was a problem verifying your payment");
        setDebug({ error: error.message, stack: error.stack });
        toast({
          title: "Error activating subscription",
          description: error.message || "There was a problem verifying your payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        if (isMounted.current) {
          setVerifying(false);
        }
      }
    };

    verifyPayment();
  }, [sessionId, navigate, toast, updateUserPaymentStatus, retries]);

  return { error, verifying, success, debug };
};

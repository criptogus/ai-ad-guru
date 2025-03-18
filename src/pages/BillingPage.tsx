import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";

const BillingPage = () => {
  const { user, updateUserPaymentStatus, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stripeBuyButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Short timeout to ensure component mounts properly
    const timer = setTimeout(() => {
      console.log("Page loading timeout completed");
      setPageLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Load Stripe buy button script
  useEffect(() => {
    if (!pageLoading && !document.querySelector('script[src*="buy-button.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      script.onload = () => {
        console.log('Stripe Buy Button script loaded');
      };
      document.body.appendChild(script);
    }
  }, [pageLoading]);

  // Handle the session_id parameter if redirected from a successful payment
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    
    if (sessionId) {
      console.log('Found session_id in URL, beginning verification:', sessionId);
      setVerifyingPayment(true);
      setError(null);
      
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
        } finally {
          setVerifyingPayment(false);
        }
      };

      verifyPayment();
    } else {
      console.log('No session_id found in URL, normal page load');
    }
  }, [location.search, navigate, toast, updateUserPaymentStatus]);

  if (pageLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Billing Information</h1>
            <p className="text-gray-600">Please wait while we prepare your subscription options...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (verifyingPayment) {
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
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
            <p className="mt-4 text-lg text-gray-600">
              You're just one step away from transforming your ad campaigns with AI.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 border rounded-md bg-red-50 border-red-200 text-red-800 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error processing payment</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Pro Subscription</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                $99/month
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>400 credits per month (1 campaign = 5 credits)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>AI-generated ad copy and images</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Google & Meta ad campaign management</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>24-hour automated campaign optimization</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>10% of ad spend fee via Stripe</span>
                </div>
              </div>
              
              {isAuthenticated ? (
                <div className="stripe-buy-button-container mt-6">
                  <stripe-buy-button
                    buy-button-id="buy_btn_1R2GrvEXrJH93iAslqq4hLcL"
                    publishable-key="pk_live_51R2FeWEXrJH93iAsggEd0ejUkIiLIoPwJLjg9Uojh3OI5qxWrU2MgXDqqgW20QBn8W3KqNbGP2LGx411c1Or7ivj00B2PPmNYj"
                  ></stripe-buy-button>
                </div>
              ) : (
                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-800">Please log in to subscribe to our Pro plan.</p>
                  <Button 
                    className="mt-2" 
                    variant="outline"
                    onClick={() => navigate("/login", { state: { from: location.pathname } })}
                  >
                    Log In
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            <br />
            Questions? Contact our support team at support@aiadguru.com
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BillingPage;

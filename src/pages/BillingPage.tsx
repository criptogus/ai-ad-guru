
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";

const BillingPage = () => {
  const { user, updateUserPaymentStatus, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Handle the session_id parameter if redirected from a successful payment
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    
    if (sessionId) {
      setLoading(true);
      
      const verifyPayment = async () => {
        try {
          // Call the edge function to verify the payment
          const { data, error } = await supabase.functions.invoke("verify-payment", {
            body: { sessionId },
          });

          if (error) {
            throw new Error(error.message);
          }

          if (data.verified) {
            // Update local state
            updateUserPaymentStatus(true);
            toast({
              title: "Payment successful!",
              description: "Your subscription has been activated.",
            });
            navigate("/dashboard");
          } else {
            toast({
              title: "Payment pending",
              description: "Your payment is being processed. We'll update your account when it's complete.",
            });
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast({
            title: "Error activating subscription",
            description: "There was a problem verifying your payment. Please contact support.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      verifyPayment();
    }
  }, [location.search, navigate, toast, updateUserPaymentStatus]);

  const handleStartSubscription = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to start a subscription.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get the current URL to use as return URL
      const returnUrl = `${window.location.origin}/billing`;
      
      // Call the edge function to create a checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { 
          userId: user?.id,
          returnUrl
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Redirect to the Stripe checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error redirecting to payment:", error);
      toast({
        title: "Error processing payment",
        description: "There was a problem setting up your payment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

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

          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Pro Subscription</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                $99/month
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
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
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                className="w-full md:w-auto px-8 py-6 text-lg gap-2" 
                onClick={handleStartSubscription}
                disabled={loading}
              >
                {loading ? "Processing..." : "Start Your Subscription"}
                {!loading && <ArrowRight className="ml-2" />}
              </Button>
            </CardFooter>
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

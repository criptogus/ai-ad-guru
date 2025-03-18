
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

// Imported Components
import BillingFeatures from "@/components/billing/BillingFeatures";
import StripeBuyButton from "@/components/billing/StripeBuyButton";
import PaymentVerification from "@/components/billing/PaymentVerification";
import LoadingState from "@/components/billing/LoadingState";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

const BillingPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Extract session_id from URL if present
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  
  useEffect(() => {
    // Short timeout to ensure component mounts properly
    const timer = setTimeout(() => {
      console.log("Page loading timeout completed");
      setPageLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // If payment verification is in progress, show the verification component
  if (sessionId) {
    return <PaymentVerification sessionId={sessionId} />;
  }

  // If page is still loading, show loading state
  if (pageLoading) {
    return <LoadingState />;
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
              <BillingFeatures />
              <StripeBuyButton isAuthenticated={isAuthenticated} />
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

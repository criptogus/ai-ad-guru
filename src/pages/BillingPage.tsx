
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/billing/LoadingState";
import PaymentVerification from "@/components/billing/PaymentVerification";
import AuthenticationRequired from "@/components/billing/AuthenticationRequired";
import BillingPageContent from "@/components/billing/BillingPageContent";
import AppLayout from "@/components/AppLayout";
import { usePaymentVerification } from "@/hooks/billing/usePaymentVerification";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const BillingPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showDevTools, setShowDevTools] = useState(false);
  
  // Extract session ID from URL if present
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  
  // Use the payment verification hook
  const { verifying, success, error } = usePaymentVerification(sessionId);
  
  // Check if we're coming from a payment verification flow
  const isPaymentVerification = !!sessionId;

  // Toggle developer tools visibility
  const toggleDevTools = () => {
    setShowDevTools(!showDevTools);
  };
  
  // Helper function to get the correct layout
  const getContent = () => {
    try {
      // If we're verifying a payment, show the verification component
      if (isPaymentVerification) {
        return (
          <Card className="max-w-2xl mx-auto">
            <PaymentVerification 
              sessionId={sessionId} 
              verifying={verifying} 
              success={success} 
              error={error} 
            />
          </Card>
        );
      }
      
      // If the user is already authenticated, show the billing page
      if (isAuthenticated) {
        return (
          <BillingPageContent
            showDevTools={showDevTools}
            toggleDevTools={toggleDevTools}
          />
        );
      }
      
      // If not authenticated and not in payment verification, show login prompt
      return <AuthenticationRequired />;
    } catch (error) {
      console.error("Error rendering billing page:", error);
      toast.error("An error occurred while loading the billing page. Please try again.");
      return <div className="p-8 text-center">An error occurred. Please try again or contact support.</div>;
    }
  };
  
  // Show loading state while auth is initializing
  if (isLoading && !isPaymentVerification) {
    return <LoadingState />;
  }
  
  return (
    <AppLayout activePage="billing">
      {getContent()}
    </AppLayout>
  );
};

export default BillingPage;


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/billing/LoadingState";
import PaymentVerification from "@/components/billing/PaymentVerification";
import AuthenticationRequired from "@/components/billing/AuthenticationRequired";
import BillingPageContent from "@/components/billing/BillingPageContent";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { usePaymentVerification } from "@/hooks/billing/usePaymentVerification";
import { testStripeConnection } from "@/services/billing/stripeConnectionTest";

const BillingPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [showDevTools, setShowDevTools] = React.useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [stripeConnectionStatus, setStripeConnectionStatus] = useState<{
    checked: boolean;
    success?: boolean;
    message?: string;
  }>({
    checked: false
  });
  
  // Extract session ID from URL if present
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  
  // Use the payment verification hook
  const { verifying, success, error } = usePaymentVerification(sessionId);
  
  // Check if we're coming from a payment verification flow
  const isPaymentVerification = !!sessionId;

  // Check Stripe connection on mount
  useEffect(() => {
    const checkStripeConnection = async () => {
      try {
        console.log('Checking Stripe API connection...');
        const result = await testStripeConnection();
        
        setStripeConnectionStatus({
          checked: true,
          success: result.success,
          message: result.message
        });

        if (!result.success) {
          console.warn('Stripe connection issue:', result.message);
          // Don't show a toast here to avoid disrupting the user experience
        }
      } catch (err) {
        console.error('Failed to check Stripe connection:', err);
        setStripeConnectionStatus({
          checked: true,
          success: false,
          message: err instanceof Error ? err.message : 'Unknown error checking Stripe connection'
        });
      }
    };
    
    checkStripeConnection();
  }, []);

  // Add effect to ensure we control page loading state properly
  useEffect(() => {
    // Wait until auth is no longer loading before showing page content
    if (!authLoading) {
      // Small delay to ensure components are ready and avoid flickering
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Toggle developer tools visibility
  const toggleDevTools = () => {
    setShowDevTools(!showDevTools);
  };
  
  // Helper function to get the correct content
  const renderContent = () => {
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
  
  return (
    <AppLayout activePage="billing">
      {pageLoading || authLoading ? <LoadingState /> : renderContent()}

      {/* Only show Stripe connection warning to authenticated users who see the main billing page */}
      {!pageLoading && !authLoading && isAuthenticated && !isPaymentVerification && 
       stripeConnectionStatus.checked && !stripeConnectionStatus.success && (
        <div className="fixed bottom-4 right-4 max-w-md p-4 bg-red-50 border border-red-200 rounded-md shadow-lg text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 z-50">
          <h4 className="font-semibold">Stripe Connection Issue</h4>
          <p className="text-sm">{stripeConnectionStatus.message || 'Unable to connect to Stripe API'}</p>
          <p className="text-xs mt-2">Please check the developer tools for more information.</p>
        </div>
      )}
    </AppLayout>
  );
};

export default BillingPage;

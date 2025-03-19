
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BillingFeatures from "@/components/billing/BillingFeatures";
import LoadingState from "@/components/billing/LoadingState";
import StripeBuyButton from "@/components/billing/StripeBuyButton";
import PaymentVerification from "@/components/billing/PaymentVerification";
import AppLayout from "@/components/AppLayout";
import { usePaymentVerification } from "@/hooks/billing/usePaymentVerification";
import { ArrowLeft, LogIn, Beaker } from "lucide-react";

const BillingPage: React.FC = () => {
  const { isAuthenticated, user, isLoading, updateUserPaymentStatus } = useAuth();
  const navigate = useNavigate();
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
        <AppLayout activePage="billing">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Button variant="ghost" className="mr-2" onClick={() => navigate("/dashboard")}>
                  <ArrowLeft size={16} />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Billing</h1>
                  <p className="text-muted-foreground">Manage your subscription</p>
                </div>
              </div>
              
              {/* Developer mode toggle button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDevTools}
                className="flex items-center gap-1"
              >
                <Beaker size={16} />
                <span>Dev Tools</span>
              </Button>
            </div>
            
            {/* Developer tools section */}
            {showDevTools && (
              <Card className="w-full max-w-2xl mx-auto mb-8 border-dashed border-amber-300 bg-amber-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-800 text-lg">Developer Tools</CardTitle>
                  <CardDescription className="text-amber-700">
                    Tools for testing payment flows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-100 rounded-md">
                      <p className="text-sm text-amber-800 mb-3">
                        These tools simulate payment actions without actually processing payments.
                        For testing purposes only.
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => updateUserPaymentStatus(true)}
                          className="bg-amber-200 hover:bg-amber-300 text-amber-900"
                        >
                          Simulate Successful Payment
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateUserPaymentStatus(false)}
                          className="border-amber-300 text-amber-800"
                        >
                          Simulate Cancellation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="mb-8">
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>AI Ad Guru Pro</CardTitle>
                  <CardDescription>
                    Unlock unlimited AI-powered ad campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BillingFeatures />
                  <div className="text-center mt-6 space-y-2">
                    <p className="text-3xl font-bold">$99.00</p>
                    <p className="text-muted-foreground">per month</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                  {user?.hasPaid ? (
                    <div className="text-center space-y-4">
                      <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-block">
                        Active Subscription
                      </div>
                      <p className="text-muted-foreground">
                        Your subscription is active. You have access to all premium features.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => updateUserPaymentStatus(false)}
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <StripeBuyButton 
                        isAuthenticated={isAuthenticated}
                        userId={user?.id} 
                        customerEmail={user?.email}
                      />
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </AppLayout>
      );
    }
    
    // If not authenticated and not in payment verification, show login prompt
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access billing and subscription features
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center p-6">
            <p className="mb-6 text-muted-foreground">
              You need to be logged in to manage your subscription and billing information.
            </p>
            <Button 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate("/login")}
            >
              <LogIn size={18} />
              <span>Go to Login</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Show loading state while auth is initializing
  if (isLoading && !isPaymentVerification) {
    return <LoadingState />;
  }
  
  return getContent();
};

export default BillingPage;

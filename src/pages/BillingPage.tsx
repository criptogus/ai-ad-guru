
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
import { ArrowLeft, LogIn } from "lucide-react";

const BillingPage: React.FC = () => {
  const { isAuthenticated, user, isLoading, updateUserPaymentStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract session ID from URL if present
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  
  // Use the payment verification hook
  const { verifying, success, error } = usePaymentVerification(sessionId);
  
  // Check if we're coming from a payment verification flow
  const isPaymentVerification = !!sessionId;
  
  // Helper function to get the correct layout
  const getContent = () => {
    // If we're verifying a payment, show the verification component
    if (isPaymentVerification) {
      return (
        <Card className="max-w-2xl mx-auto">
          <PaymentVerification 
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
            <div className="flex items-center mb-8">
              <Button variant="ghost" className="mr-2" onClick={() => navigate("/dashboard")}>
                <ArrowLeft size={16} />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Billing</h1>
                <p className="text-muted-foreground">Manage your subscription</p>
              </div>
            </div>
            
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
                    <p className="text-3xl font-bold">$49.99</p>
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

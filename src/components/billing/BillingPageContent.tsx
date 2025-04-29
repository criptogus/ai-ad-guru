
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCreditsVerification } from "@/hooks/billing/useCreditsVerification";
import { toast } from "sonner";
import BillingHeader from "./BillingHeader";
import DevToolsSection from "./DevToolsSection";
import PendingPurchaseBanner from "./PendingPurchaseBanner";
import RequiredCreditsBanner from "./RequiredCreditsBanner";
import ProcessingBanner from "./ProcessingBanner";
import CreditsPurchaseSection from "./CreditsPurchaseSection";
import { Skeleton } from "@/components/ui/skeleton";

interface BillingPageContentProps {
  showDevTools: boolean;
  toggleDevTools: () => void;
}

const BillingPageContent: React.FC<BillingPageContentProps> = ({ 
  showDevTools, 
  toggleDevTools 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUserPaymentStatus, checkSubscriptionStatus } = useAuth();
  const [hasPendingPurchase, setHasPendingPurchase] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  
  const { checking, processing, hasClaimedFreeCredits, checkFreeCreditsStatus } = useCreditsVerification();

  const state = location.state as { from?: string; requiredCredits?: number } | null;
  const fromCampaign = state?.from === 'campaign';
  const requiredCredits = state?.requiredCredits || 0;
  
  useEffect(() => {
    try {
      const storedPurchaseIntent = localStorage.getItem('credit_purchase_intent');
      setHasPendingPurchase(!!storedPurchaseIntent);
      
      const checkSubscription = async () => {
        if (user) {
          try {
            const hasSubscription = await checkSubscriptionStatus();
            if (hasSubscription) {
              const returnPath = sessionStorage.getItem('returnAfterBilling');
              if (returnPath) {
                sessionStorage.removeItem('returnAfterBilling');
                navigate(returnPath);
              }
            }
          } catch (error) {
            console.error("Error checking subscription status:", error);
          }
        }
      };
      
      checkSubscription();
      
      // Check free credits status again to make sure it's up to date
      if (user?.id) {
        checkFreeCreditsStatus();
      }
      
      // Set a timer to simulate loading the content to prevent flickering
      const timer = setTimeout(() => {
        setContentLoading(false);
      }, 200);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error in billing page effect:", error);
      setContentLoading(false);
    }
  }, [user, checkSubscriptionStatus, navigate, checkFreeCreditsStatus]);
  
  const handleVerifyPurchase = () => {
    window.location.reload();
  };

  if (contentLoading || checking) {
    return (
      <div className="w-full space-y-6">
        {/* Skeleton for header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-2" />
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        
        {/* Skeleton for content section */}
        <Skeleton className="h-32 mb-4" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <BillingHeader toggleDevTools={toggleDevTools} />
      
      {showDevTools && (
        <DevToolsSection updateUserPaymentStatus={updateUserPaymentStatus} />
      )}
      
      {hasPendingPurchase && !processing && (
        <PendingPurchaseBanner onVerify={handleVerifyPurchase} />
      )}
      
      {fromCampaign && requiredCredits > 0 && (
        <RequiredCreditsBanner requiredCredits={requiredCredits} />
      )}
      
      {processing && <ProcessingBanner />}
      
      <div className="space-y-8">
        <CreditsPurchaseSection 
          userId={user?.id} 
          credits={user?.credits}
        />
      </div>
    </div>
  );
};

export default BillingPageContent;

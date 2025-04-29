
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Beaker, ArrowLeft, History, RefreshCw, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CreditsPurchaseCard from "./CreditsPurchaseCard";
import DevToolsSection from "./DevToolsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import CreditUsageHistory from "./CreditUsageHistory";
import { useCreditsVerification } from "@/hooks/billing/useCreditsVerification";
import { toast } from "sonner";

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
  const [showCreditHistory, setShowCreditHistory] = useState(false);
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Billing</h1>
              <p className="text-muted-foreground">Manage your credits and purchases</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        
        <Card>
          <div className="p-6">
            <Skeleton className="h-8 w-64 mb-3" />
            <Skeleton className="h-4 w-full max-w-xl mb-6" />
            
            {/* Free credits card skeleton */}
            <div className="mb-6">
              <Card className="relative border-2 p-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs py-1 px-4 rounded-full">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-36 mb-2" />
                    <Skeleton className="h-4 w-60 mb-2" />
                    <div className="space-y-2 mt-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </Card>
            </div>
            
            {/* Credit packs skeletons */}
            <div className="grid gap-4 md:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="relative border-2">
                  <div className="p-6">
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-20 mb-4" />
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Manage your credits and purchases</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => navigate("/billing/history")}
          >
            <History size={16} />
            <span>Billing History</span>
          </Button>
          
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
      </div>
      
      {showDevTools && (
        <DevToolsSection updateUserPaymentStatus={updateUserPaymentStatus} />
      )}
      
      {hasPendingPurchase && !processing && (
        <Card className="p-4 mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <p className="text-blue-800 dark:text-blue-200">
              You have a pending credit purchase. Click the button to verify and add credits to your account.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 bg-white dark:bg-gray-700" 
              onClick={handleVerifyPurchase}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Verify Purchase
            </Button>
          </div>
        </Card>
      )}
      
      {fromCampaign && requiredCredits > 0 && (
        <Card className="p-4 mb-6 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200">
            You need <strong>{requiredCredits} more credits</strong> to create this campaign. 
            Please purchase more credits below.
          </p>
        </Card>
      )}
      
      {processing && (
        <Card className="p-4 mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-700 dark:text-blue-300" />
            <p className="text-blue-800 dark:text-blue-200">
              Processing your recent credit activity. This will be reflected in your account shortly.
            </p>
          </div>
        </Card>
      )}
      
      <div className="space-y-8">
        {user && typeof user.credits === 'number' ? (
          <CreditsPurchaseCard userId={user.id} currentCredits={user.credits} />
        ) : (
          <Card className="p-8">
            <Skeleton className="h-8 w-64 mb-3" />
            <Skeleton className="h-4 w-full max-w-xl mb-6" />
            <Skeleton className="h-40 w-full" />
          </Card>
        )}
      </div>
    </div>
  );
};

export default BillingPageContent;

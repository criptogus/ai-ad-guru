
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Beaker, ArrowLeft, History, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CreditsPurchaseCard from "./CreditsPurchaseCard";
import DevToolsSection from "./DevToolsSection";
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
  
  const { checking, processing, hasClaimedFreeCredits } = useCreditsVerification();

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
    } catch (error) {
      console.error("Error in billing page effect:", error);
    }
  }, [user, checkSubscriptionStatus, navigate]);
  
  const handleVerifyPurchase = () => {
    window.location.reload();
  };

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
          <p className="text-blue-800 dark:text-blue-200">
            Processing your recent credit purchase. This will be reflected in your account shortly.
          </p>
        </Card>
      )}
      
      <div className="space-y-8">
        {user && (
          <CreditsPurchaseCard userId={user?.id} currentCredits={user?.credits || 0} />
        )}
      </div>
    </div>
  );
};

export default BillingPageContent;

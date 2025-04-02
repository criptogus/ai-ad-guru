
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Beaker, ArrowLeft, History, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BillingSubscriptionCard from "./BillingSubscriptionCard";
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
  
  // Handle the credits verification
  const { processing } = useCreditsVerification();

  // Check if we're coming from campaign creation with required credits
  const state = location.state as { from?: string; requiredCredits?: number } | null;
  const fromCampaign = state?.from === 'campaign';
  const requiredCredits = state?.requiredCredits || 0;
  
  // Check for pending purchases on component mount
  useEffect(() => {
    try {
      const storedPurchaseIntent = localStorage.getItem('credit_purchase_intent');
      setHasPendingPurchase(!!storedPurchaseIntent);
      
      // Check if there's a return path after successful subscription
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
  
  // Force a refresh of the component to trigger useCreditsVerification
  const handleVerifyPurchase = () => {
    window.location.reload();
  };

  return (
    <div className="p-6">
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
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <History size={16} />
                <span>Credit History</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Credit Usage History</DialogTitle>
                <DialogDescription>
                  View your credit usage history and purchases
                </DialogDescription>
              </DialogHeader>
              {user && <CreditUsageHistory userId={user.id} />}
            </DialogContent>
          </Dialog>
          
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
      </div>
      
      {/* Developer tools section */}
      {showDevTools && (
        <DevToolsSection updateUserPaymentStatus={updateUserPaymentStatus} />
      )}
      
      {/* Show info if there's a pending purchase */}
      {hasPendingPurchase && !processing && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-blue-800">
              You have a pending credit purchase. Click the button to verify and add credits to your account.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 bg-white" 
              onClick={handleVerifyPurchase}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Verify Purchase
            </Button>
          </div>
        </Card>
      )}
      
      {/* Show warning if coming from campaign with insufficient credits */}
      {fromCampaign && requiredCredits > 0 && (
        <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
          <p className="text-amber-800">
            You need <strong>{requiredCredits} more credits</strong> to create this campaign. 
            Please purchase more credits below.
          </p>
        </Card>
      )}
      
      {/* Show info if credits are being processed */}
      {processing && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <p className="text-blue-800">
            Processing your recent credit purchase. This will be reflected in your account shortly.
          </p>
        </Card>
      )}
      
      <div className="space-y-8">
        {/* Credits Purchase Card */}
        {user && (
          <CreditsPurchaseCard userId={user?.id} currentCredits={user?.credits || 0} />
        )}

        {/* Subscription Card */}
        <BillingSubscriptionCard 
          user={user} 
          updateUserPaymentStatus={updateUserPaymentStatus} 
        />
      </div>
    </div>
  );
};

export default BillingPageContent;

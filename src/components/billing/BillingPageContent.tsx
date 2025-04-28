
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
import { Skeleton } from "@/components/ui/skeleton";

interface BillingPageContentProps {
  showDevTools: boolean;
  toggleDevTools: () => void;
  stripeConnectionStatus: {
    checked: boolean;
    success?: boolean;
    message?: string;
  };
}

const BillingPageContent: React.FC<BillingPageContentProps> = ({ 
  showDevTools, 
  toggleDevTools,
  stripeConnectionStatus
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUserPaymentStatus, checkSubscriptionStatus } = useAuth();
  const [loadingCredits, setLoadingCredits] = useState(true);
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
          } finally {
            // Simulando tempo de carregamento para os créditos
            setTimeout(() => {
              setLoadingCredits(false);
            }, 600);
          }
        }
      };
      
      checkSubscription();
    } catch (error) {
      console.error("Error in billing page effect:", error);
      setLoadingCredits(false);
    }
  }, [user, checkSubscriptionStatus, navigate]);
  
  const handleVerifyPurchase = () => {
    window.location.reload();
  };

  // Renderiza o alerta de conexão Stripe em um local que não afeta o layout
  const renderStripeConnectionAlert = () => {
    if (stripeConnectionStatus.checked && !stripeConnectionStatus.success) {
      return (
        <Card className="p-4 mb-6 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <p className="text-amber-800 dark:text-amber-200">
              <strong>Alerta:</strong> Problema de conexão com Stripe detectado. Algumas funções de pagamento podem estar indisponíveis.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 bg-white dark:bg-gray-700" 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Cobrança</h1>
            <p className="text-muted-foreground">Gerencie seus créditos e compras</p>
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
            <span>Histórico de Cobrança</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleDevTools}
            className="flex items-center gap-1"
          >
            <Beaker size={16} />
            <span>Ferramentas de Dev</span>
          </Button>
        </div>
      </div>
      
      {showDevTools && (
        <DevToolsSection 
          updateUserPaymentStatus={updateUserPaymentStatus}
          stripeConnectionStatus={stripeConnectionStatus}
        />
      )}
      
      {renderStripeConnectionAlert()}
      
      {hasPendingPurchase && !processing && (
        <Card className="p-4 mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <p className="text-blue-800 dark:text-blue-200">
              Você tem uma compra de crédito pendente. Clique no botão para verificar e adicionar créditos à sua conta.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 bg-white dark:bg-gray-700" 
              onClick={handleVerifyPurchase}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Verificar Compra
            </Button>
          </div>
        </Card>
      )}
      
      {fromCampaign && requiredCredits > 0 && (
        <Card className="p-4 mb-6 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200">
            Você precisa de <strong>{requiredCredits} mais créditos</strong> para criar esta campanha. 
            Por favor, compre mais créditos abaixo.
          </p>
        </Card>
      )}
      
      {processing && (
        <Card className="p-4 mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200">
            Processando sua compra recente de crédito. Isso será refletido em sua conta em breve.
          </p>
        </Card>
      )}
      
      <div className="space-y-8">
        {loadingCredits ? (
          // Skeleton para o card de compra enquanto carrega
          <Card className="p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-5 w-full mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </Card>
        ) : (
          user && (
            <CreditsPurchaseCard userId={user?.id} currentCredits={user?.credits || 0} />
          )
        )}
      </div>
    </div>
  );
};

export default BillingPageContent;

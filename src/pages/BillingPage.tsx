
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
  const [showDevTools, setShowDevTools] = useState(false);
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

  // Combinando os estados de loading em um único controlador
  const isLoading = authLoading || pageLoading;

  // Check Stripe connection on mount - mas não bloqueia a UI
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

  // Gerenciamento de estado de loading com timing consistente
  useEffect(() => {
    if (!authLoading) {
      // Delay pequeno para garantir fluidez na transição
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
      // Se estamos verificando um pagamento, mostramos o componente de verificação
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
      
      // Se o usuário já estiver autenticado, mostramos a página de cobrança
      if (isAuthenticated) {
        return (
          <BillingPageContent
            showDevTools={showDevTools}
            toggleDevTools={toggleDevTools}
            stripeConnectionStatus={stripeConnectionStatus}
          />
        );
      }
      
      // Se não estiver autenticado e não estiver em verificação de pagamento, mostramos prompt de login
      return <AuthenticationRequired />;
    } catch (error) {
      console.error("Error rendering billing page:", error);
      toast.error("Ocorreu um erro ao carregar a página de cobrança. Por favor, tente novamente.");
      return <div className="p-8 text-center">Ocorreu um erro. Por favor, tente novamente ou entre em contato com o suporte.</div>;
    }
  };
  
  return (
    <AppLayout activePage="billing">
      {isLoading ? <LoadingState /> : renderContent()}

      {/* Só mostramos aviso de conexão Stripe para usuários autenticados que veem a página principal de cobrança */}
      {!isLoading && isAuthenticated && !isPaymentVerification && 
       stripeConnectionStatus.checked && !stripeConnectionStatus.success && (
        <div className="fixed bottom-4 right-4 max-w-md p-4 bg-red-50 border border-red-200 rounded-md shadow-lg text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 z-50">
          <h4 className="font-semibold">Problema de Conexão Stripe</h4>
          <p className="text-sm">{stripeConnectionStatus.message || 'Não foi possível conectar à API Stripe'}</p>
          <p className="text-xs mt-2">Verifique as ferramentas de desenvolvimento para mais informações.</p>
        </div>
      )}
    </AppLayout>
  );
};

export default BillingPage;

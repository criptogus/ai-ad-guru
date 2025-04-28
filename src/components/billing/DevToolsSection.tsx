
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { testStripeConnection } from '@/services/billing/stripeConnectionTest';
import { Loading } from '@/components/ui/loading';
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface DevToolsSectionProps {
  updateUserPaymentStatus: (status: boolean) => Promise<void>;
  stripeConnectionStatus: {
    checked: boolean;
    success?: boolean;
    message?: string;
  };
}

const DevToolsSection: React.FC<DevToolsSectionProps> = ({ 
  updateUserPaymentStatus,
  stripeConnectionStatus 
}) => {
  const { simulateSuccessfulPayment } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  
  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    try {
      await simulateSuccessfulPayment();
      toast.success("Pagamento simulado com sucesso!");
    } catch (error) {
      console.error("Error simulating payment:", error);
      toast.error("Falha ao simular pagamento");
    } finally {
      setIsSimulating(false);
    }
  };

  // Componente de teste de conexão Stripe
  const StripeConnectionTest = () => {
    const [testing, setTesting] = useState(false);
    const [result, setResult] = useState<{
      success?: boolean;
      message?: string;
      apiVersion?: string;
    }>(stripeConnectionStatus);

    // Não verifica automaticamente novamente se já temos o resultado
    useEffect(() => {
      if (!stripeConnectionStatus.checked) {
        handleTestConnection();
      } else {
        setResult(stripeConnectionStatus);
      }
    }, []);

    const handleTestConnection = async () => {
      setTesting(true);
      try {
        const testResult = await testStripeConnection();
        setResult(testResult);
        if (testResult.success) {
          toast.success("Conectado com sucesso à API Stripe");
        } else {
          toast.error("Falha ao conectar à API Stripe");
        }
      } catch (error) {
        console.error('Error in Stripe connection test:', error);
        setResult({
          success: false,
          message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        toast.error("Erro ao testar conexão Stripe");
      } finally {
        setTesting(false);
      }
    };

    return (
      <div className="p-4 border rounded-md mt-4">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          Teste de Conexão API Stripe
          {result.success !== undefined && (
            result.success ? 
            <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </h3>
        <div className="flex space-x-2 mb-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnection} 
            disabled={testing}
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar Conexão Stripe'
            )}
          </Button>
        </div>
        
        {testing ? (
          <Loading size="sm" className="py-2" />
        ) : result.success !== undefined ? (
          <div className={`mt-2 p-3 rounded text-sm ${result.success ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
            <p className="font-medium">{result.success ? 'Sucesso' : 'Falha'}</p>
            <p>{result.message}</p>
            {result.apiVersion && <p className="text-xs mt-1">Versão da API: {result.apiVersion}</p>}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas de Desenvolvedor</CardTitle>
          <CardDescription>Ferramentas de teste e depuração para pagamentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="destructive" 
              onClick={() => updateUserPaymentStatus(false)}
              size="sm"
            >
              Cancelar Assinatura (Apenas Dev)
            </Button>
            
            <Button 
              variant="outline"
              size="sm" 
              disabled={isSimulating}
              onClick={handleSimulatePayment}
            >
              {isSimulating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulando...
                </>
              ) : (
                "Simular Pagamento Bem-sucedido"
              )}
            </Button>
          </div>
          
          {/* Componente de teste de conexão Stripe */}
          <StripeConnectionTest />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevToolsSection;

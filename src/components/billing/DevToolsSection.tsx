import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { testStripeConnection } from '@/services/billing/stripeConnectionTest';
import { Loading } from '@/components/ui/loading';
import { Loader2 } from "lucide-react";

const DevToolsSection = ({ updateUserPaymentStatus }) => {
  const { simulateSuccessfulPayment } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  
  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    try {
      await simulateSuccessfulPayment();
      toast.success("Simulated successful payment!");
    } catch (error) {
      console.error("Error simulating payment:", error);
      toast.error("Failed to simulate payment");
    } finally {
      setIsSimulating(false);
    }
  };

  // Add new function for Stripe connection test
  const StripeConnectionTest = () => {
    const [testing, setTesting] = useState(false);
    const [result, setResult] = useState<{
      success?: boolean;
      message?: string;
      apiVersion?: string;
    }>({});

    const handleTestConnection = async () => {
      setTesting(true);
      try {
        const testResult = await testStripeConnection();
        setResult(testResult);
      } catch (error) {
        console.error('Error in Stripe connection test:', error);
        setResult({
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      } finally {
        setTesting(false);
      }
    };

    return (
      <div className="p-4 border rounded-md mt-4">
        <h3 className="text-lg font-medium mb-2">Stripe API Connection Test</h3>
        <div className="flex space-x-2 mb-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnection} 
            disabled={testing}
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Stripe Connection'
            )}
          </Button>
        </div>
        
        {testing ? (
          <Loading size="sm" className="py-2" />
        ) : result.success !== undefined ? (
          <div className={`mt-2 p-3 rounded text-sm ${result.success ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
            <p className="font-medium">{result.success ? 'Success' : 'Failed'}</p>
            <p>{result.message}</p>
            {result.apiVersion && <p className="text-xs mt-1">API Version: {result.apiVersion}</p>}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Developer Tools</CardTitle>
          <CardDescription>Testing and debugging tools for payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={() => updateUserPaymentStatus(false)}
          >
            Cancel Subscription (Dev Only)
          </Button>
          
          <Button 
            variant="outline" 
            disabled={isSimulating}
            onClick={handleSimulatePayment}
          >
            {isSimulating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simulating...
              </>
            ) : (
              "Simulate Successful Payment"
            )}
          </Button>
          
          {/* Add the new Stripe connection test component */}
          <StripeConnectionTest />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevToolsSection;

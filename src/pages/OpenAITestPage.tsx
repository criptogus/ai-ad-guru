
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, SendIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OpenAITestPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    response?: string;
    error?: string;
  } | null>(null);

  const testOpenAI = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-openai');
      
      if (error) {
        console.error('Error testing OpenAI:', error);
        throw error;
      }
      
      setResult(data);
      
      if (data.success) {
        toast({
          title: "API Connection Successful",
          description: "Successfully connected to OpenAI API",
        });
      } else {
        toast({
          title: "API Connection Failed",
          description: data.error || "Failed to connect to OpenAI API",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in OpenAI test:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast({
        title: "Test Failed",
        description: "Error executing the API test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout activePage="none">
      <div className="p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">OpenAI API Test</h1>
            <p className="text-muted-foreground">Verify your OpenAI API connection</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>
              This tool will test your OpenAI API connection to help diagnose any issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to test your OpenAI API connection. This will send a simple request 
                  to the OpenAI API and verify that your API key is working correctly.
                </p>
                <Button 
                  onClick={testOpenAI} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing API Connection...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-2 h-4 w-4" />
                      Test OpenAI API Connection
                    </>
                  )}
                </Button>
              </div>

              {result && (
                <div className={`mt-6 p-4 rounded-md border ${
                  result.success 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium text-green-800">Connection Successful</h3>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h3 className="font-medium text-red-800">Connection Failed</h3>
                      </>
                    )}
                  </div>
                  
                  {result.success ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-700">{result.message}</p>
                      {result.response && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-green-700">API Response:</p>
                          <p className="text-sm bg-white p-2 rounded border border-green-200 mt-1">
                            {result.response}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-red-700">Error: {result.error}</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-red-700">Troubleshooting:</p>
                        <ul className="list-disc list-inside text-sm text-red-700 mt-1 space-y-1">
                          <li>Verify that your OpenAI API key is correctly set in Supabase Edge Function secrets</li>
                          <li>Check that your OpenAI account has sufficient credits/quota</li>
                          <li>Ensure the API key has the correct permissions</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OpenAI API Key Information</CardTitle>
            <CardDescription>
              How to get and configure your OpenAI API key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Getting an API Key:</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI API Keys page</a></li>
                  <li>Sign in to your OpenAI account (or create one if needed)</li>
                  <li>Click "Create new secret key"</li>
                  <li>Give your key a name and copy the key (you won't be able to see it again)</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Setting Up Your API Key:</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  <li>Go to your Supabase project dashboard</li>
                  <li>Navigate to Settings → Edge Functions → Secrets</li>
                  <li>Add a secret with name "OPENAI_API_KEY" and paste your API key as the value</li>
                  <li>Save the secret and re-deploy your edge functions if needed</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default OpenAITestPage;

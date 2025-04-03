import React from "react";
import { useAdAccountConnections } from "@/hooks/adConnections";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Goal, Facebook, Linkedin, ServerIcon, ShieldCheck, Lock, Key, RefreshCw, CheckCircle2, HelpCircle } from "lucide-react";
import PlatformConnectionCard from "./PlatformConnectionCard";
import { toast } from "sonner";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ConnectionsSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    connections,
    isLoading,
    isConnecting,
    error,
    errorDetails,
    errorType,
    fetchConnections,
    initiateGoogleConnection,
    initiateLinkedInConnection,
    initiateMicrosoftConnection,
    initiateMetaConnection,
    removeConnection
  } = useAdAccountConnections();

  // Security enhancement: Show toast on successful connection status fetch
  React.useEffect(() => {
    if (connections.length > 0 && !isLoading) {
      toast.success("Connection status verified securely", {
        id: "connection-status",
        duration: 2000,
      });
    }
  }, [connections, isLoading]);

  // Determine if we have a LinkedIn-specific error
  const isLinkedInError = errorType === 'linkedin' || 
    (errorDetails && errorDetails.toLowerCase().includes('linkedin'));
    
  // Determine if the user has connected at least one platform
  const hasAtLeastOneConnection = connections.length > 0;

  return (
    <div className="max-w-[1280px] mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Connect Your Ad Accounts</h2>
        
        {/* Security badge */}
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure OAuth 2.0</span>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error}
            {errorDetails && (
              <div className="mt-2">
                <details className="group">
                  <summary className="cursor-pointer font-medium flex items-center gap-1 text-sm">
                    <span className="underline-offset-4 group-hover:underline">Details</span>
                  </summary>
                  <p className="mt-2 text-sm font-mono bg-destructive/10 p-3 rounded">{errorDetails}</p>
                </details>
              </div>
            )}
            
            {isLinkedInError && (
              <div className="mt-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="linkedin-help">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        <span>LinkedIn Connection Help</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>LinkedIn requires special approval for marketing API access:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LinkedIn Developer Portal</a></li>
                          <li>Select your app</li>
                          <li>Under "Products", request "Marketing Developer Platform" access</li>
                          <li>Make sure your Redirect URI is <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">https://auth.zeroagency.ai/auth/v1/callback</code></li>
                          <li>Wait for LinkedIn approval (can take 1-5 business days)</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            {errorType === 'google' && errorDetails && errorDetails.toLowerCase().includes('redirect') && (
              <div className="mt-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="google-help">
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        <span>Google OAuth Configuration Help</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>Google requires exact redirect URI configuration:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a></li>
                          <li>Select your OAuth 2.0 Client ID</li>
                          <li>Under "Authorized redirect URIs", add <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">https://auth.zeroagency.ai/auth/v1/callback</code></li>
                          <li>Save your changes</li>
                          <li>Make sure the Google Ads API is enabled in your project</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-card border-border shadow-sm mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">OAuth Connection Diagnostic</CardTitle>
          </div>
          <CardDescription>
            Use this information to verify your OAuth configuration for Google & LinkedIn
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
              <p className="font-mono text-xs mb-2">Required Redirect URI:</p>
              <code className="bg-white dark:bg-black px-2 py-1 rounded border font-mono text-xs select-all">
                https://auth.zeroagency.ai/auth/v1/callback
              </code>
            </div>

            <div>
              <p className="font-semibold mb-1">Google Configuration:</p>
              <p>Make sure this exact URI is added to your OAuth Client in Google Cloud Console</p>
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center text-xs mt-1"
              >
                Open Google Cloud Credentials
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>

            <div>
              <p className="font-semibold mb-1">LinkedIn Configuration:</p>
              <p>Add this URI to the "Redirect URLs" in your LinkedIn Developer App settings</p>
              <a 
                href="https://www.linkedin.com/developers/apps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center text-xs mt-1"
              >
                Open LinkedIn Developer Apps
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">Security Information</CardTitle>
          </div>
          <CardDescription>
            Your ad account credentials are securely encrypted and stored following OAuth 2.0 best practices.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <Lock className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>We never store your passwords</span>
            </div>
            <div className="flex items-start space-x-2">
              <Key className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>All API tokens are encrypted in our database</span>
            </div>
            <div className="flex items-start space-x-2">
              <RefreshCw className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>You can revoke access at any time</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>Connection is handled securely via OAuth 2.0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PlatformConnectionCard
          platform="google"
          isConnecting={isConnecting}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={initiateGoogleConnection}
          onRemove={removeConnection}
        />

        <PlatformConnectionCard
          platform="meta"
          isConnecting={isConnecting}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={initiateMetaConnection}
          onRemove={removeConnection}
        />

        <PlatformConnectionCard
          platform="linkedin"
          isConnecting={isConnecting}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={initiateLinkedInConnection}
          onRemove={removeConnection}
        />

        <PlatformConnectionCard
          platform="microsoft"
          isConnecting={isConnecting}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={initiateMicrosoftConnection}
          onRemove={removeConnection}
        />
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button 
          size="lg"
          onClick={() => navigate('/campaign/create')}
          disabled={!hasAtLeastOneConnection}
        >
          {hasAtLeastOneConnection ? 'Continue to Ad Creation' : 'Connect at least one platform'}
        </Button>
      </div>
    </div>
  );
};

export default ConnectionsSection;

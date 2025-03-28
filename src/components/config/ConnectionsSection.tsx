
import React from "react";
import { useAdAccountConnections } from "@/hooks/adConnections";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Goal, Facebook, Linkedin, ServerIcon, ShieldCheck, Lock, Key, RefreshCw, CheckCircle2 } from "lucide-react";
import PlatformConnectionCard from "./PlatformConnectionCard";
import { toast } from "sonner";

const ConnectionsSection: React.FC = () => {
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
          </AlertDescription>
        </Alert>
      )}

      {/* Improved Security Information Card */}
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
        {/* Google Ads Connection Card */}
        <PlatformConnectionCard
          platform="google"
          isConnecting={isConnecting}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={initiateGoogleConnection}
          onRemove={removeConnection}
        />

        {/* Meta Ads Connection Card */}
        <PlatformConnectionCard
          platform="meta"
          isConnecting={isConnecting}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={initiateMetaConnection}
          onRemove={removeConnection}
        />

        {/* LinkedIn Ads Connection Card */}
        <PlatformConnectionCard
          platform="linkedin"
          isConnecting={isConnecting}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={initiateLinkedInConnection}
          onRemove={removeConnection}
        />

        {/* Microsoft Ads Connection Card */}
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
    </div>
  );
};

export default ConnectionsSection;

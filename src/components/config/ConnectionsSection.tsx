
import React from "react";
import { useAdAccountConnections } from "@/hooks/useAdAccountConnections";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Goal, Facebook, Linkedin, Microsoft } from "lucide-react";
import PlatformConnectionCard from "./PlatformConnectionCard";

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

  return (
    <div className="max-w-[1280px] mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6">Connect Your Ad Accounts</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error}
            {errorDetails && (
              <div className="mt-2 text-sm">
                <details>
                  <summary className="cursor-pointer font-medium">Details</summary>
                  <p className="mt-2">{errorDetails}</p>
                </details>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

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

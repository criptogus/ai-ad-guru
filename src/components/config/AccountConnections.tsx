
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { useAdAccountConnections } from "@/hooks/adConnections";

import AccountErrorDisplay from "./AccountErrorDisplay";
import PlatformConnectionCard from "./PlatformConnectionCard";
import ConnectionInfoBox from "./ConnectionInfoBox";

const AccountConnections: React.FC = () => {
  const {
    connections,
    isLoading,
    isConnecting,
    error,
    errorDetails,
    errorType,
    initiateGoogleConnection,
    initiateLinkedInConnection,
    initiateMicrosoftConnection,
    removeConnection,
    fetchConnections
  } = useAdAccountConnections();

  // Clear error when connections change
  useEffect(() => {
    console.log("Connections updated:", connections);
  }, [connections]);

  const handleGoogleConnection = async () => {
    try {
      console.log("Initiating Google connection...");
      await initiateGoogleConnection();
    } catch (err: any) {
      console.error("Google connection error:", err);
      // Error is already handled in the hook
    }
  };

  const handleLinkedInConnection = async () => {
    try {
      console.log("Initiating LinkedIn connection...");
      await initiateLinkedInConnection();
    } catch (err: any) {
      console.error("LinkedIn connection error:", err);
      // Error is already handled in the hook
    }
  };

  const handleMicrosoftConnection = async () => {
    try {
      console.log("Initiating Microsoft Ads connection...");
      await initiateMicrosoftConnection();
    } catch (err: any) {
      console.error("Microsoft Ads connection error:", err);
      // Error is already handled in the hook
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ad Platform Connections</CardTitle>
          <CardDescription>
            Connect your Google Ads, LinkedIn Ads, and Microsoft Ads accounts to manage campaigns
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={fetchConnections}
          disabled={isLoading || isConnecting}
          title="Refresh connections"
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <AccountErrorDisplay 
          error={error}
          errorDetails={errorDetails}
          errorType={errorType}
        />

        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <PlatformConnectionCard
              platform="google"
              connections={connections}
              isConnecting={isConnecting}
              onConnect={handleGoogleConnection}
              onRemove={removeConnection}
              errorType={errorType}
              errorDetails={errorDetails}
            />

            <Separator />

            <PlatformConnectionCard
              platform="linkedin"
              connections={connections}
              isConnecting={isConnecting}
              onConnect={handleLinkedInConnection}
              onRemove={removeConnection}
              errorType={errorType}
              errorDetails={errorDetails}
            />
            
            <Separator />

            <PlatformConnectionCard
              platform="microsoft"
              connections={connections}
              isConnecting={isConnecting}
              onConnect={handleMicrosoftConnection}
              onRemove={removeConnection}
              errorType={errorType}
              errorDetails={errorDetails}
            />
            
            <ConnectionInfoBox hasError={!!error} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountConnections;


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
    connectingPlatform,
    error,
    errorDetails,
    errorType,
    initiateGoogleConnection,
    initiateLinkedInConnection,
    initiateMicrosoftConnection,
    initiateMetaConnection,
    removeConnection,
    fetchConnections
  } = useAdAccountConnections();

  // Clear error when connections change
  useEffect(() => {
    console.log("Connections updated:", connections);
  }, [connections]);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ad Platform Connections</CardTitle>
          <CardDescription>
            Connect your ad accounts to manage campaigns
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
              connectingPlatform={connectingPlatform}
              onConnect={initiateGoogleConnection}
              onRemove={removeConnection}
              errorType={errorType}
              errorDetails={errorDetails}
            />

            <Separator />

            <PlatformConnectionCard
              platform="meta"
              connections={connections}
              isConnecting={isConnecting}
              connectingPlatform={connectingPlatform}
              onConnect={initiateMetaConnection}
              onRemove={removeConnection}
              errorType={errorType}
              errorDetails={errorDetails}
            />

            <Separator />
            
            <PlatformConnectionCard
              platform="linkedin"
              connections={connections}
              isConnecting={isConnecting}
              connectingPlatform={connectingPlatform}
              onConnect={initiateLinkedInConnection}
              onRemove={removeConnection}
              errorType={errorType}
              errorDetails={errorDetails}
            />
            
            <Separator />

            <PlatformConnectionCard
              platform="microsoft"
              connections={connections}
              isConnecting={isConnecting}
              connectingPlatform={connectingPlatform}
              onConnect={initiateMicrosoftConnection}
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

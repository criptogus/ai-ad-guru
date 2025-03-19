
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { useAdAccountConnections } from "@/hooks/useAdAccountConnections";

import AccountErrorDisplay from "./AccountErrorDisplay";
import PlatformConnectionCard from "./PlatformConnectionCard";
import ConnectionInfoBox from "./ConnectionInfoBox";

const AccountConnections: React.FC = () => {
  const {
    connections,
    isLoading,
    isConnecting,
    initiateGoogleConnection,
    initiateMetaConnection,
    removeConnection,
    fetchConnections
  } = useAdAccountConnections();

  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  // Clear error when connections change
  useEffect(() => {
    if (connections.length > 0) {
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
    }
  }, [connections]);

  const handleGoogleConnection = async () => {
    try {
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      await initiateGoogleConnection();
    } catch (err: any) {
      setError(err.message || "Failed to connect to Google Ads");
      
      // Set more detailed error information if available
      if (err.message && err.message.includes("Admin needs to configure")) {
        setErrorType("credentials");
        setErrorDetails("Please ensure all required Google API credentials are set in Supabase Edge Function secrets: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_DEVELOPER_TOKEN.");
      } else if (err.message && err.message.includes("Edge function error")) {
        setErrorType("edge_function");
        setErrorDetails("There may be an issue with the Supabase Edge Function configuration. Check the Edge Function logs for more details.");
      } else if (err.message && err.message.includes("non-2xx status")) {
        setErrorType("edge_function");
        setErrorDetails("The Supabase Edge Function returned an error. Verify that all Google API credentials are properly configured in the Edge Function secrets and that the function is correctly deployed.");
      }
    }
  };

  const handleMetaConnection = async () => {
    try {
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      await initiateMetaConnection();
    } catch (err: any) {
      setError(err.message || "Failed to connect to Meta Ads");
      
      // Set more detailed error information if available
      if (err.message && err.message.includes("Admin needs to configure")) {
        setErrorType("credentials");
        setErrorDetails("Please ensure all required Meta API credentials are set in Supabase Edge Function secrets: META_CLIENT_ID and META_CLIENT_SECRET.");
      } else if (err.message && err.message.includes("Edge function error")) {
        setErrorType("edge_function");
        setErrorDetails("There may be an issue with the Supabase Edge Function configuration. Check the Edge Function logs for more details.");
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ad Platform Connections</CardTitle>
          <CardDescription>
            Connect your Google Ads and Meta Ads accounts to manage campaigns
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
              platformDisplayName="Google Ads"
              connections={connections}
              isConnecting={isConnecting}
              onConnect={handleGoogleConnection}
              onDisconnect={removeConnection}
            />

            <Separator />

            <PlatformConnectionCard
              platform="meta"
              platformDisplayName="Meta Ads"
              connections={connections}
              isConnecting={isConnecting}
              onConnect={handleMetaConnection}
              onDisconnect={removeConnection}
            />
            
            <ConnectionInfoBox hasError={!!error} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountConnections;

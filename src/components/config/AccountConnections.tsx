
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, RefreshCw, Info, ExternalLink } from "lucide-react";
import { useAdAccountConnections } from "@/hooks/useAdAccountConnections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  // Clear error when connections change
  useEffect(() => {
    if (connections.length > 0) {
      setError(null);
      setErrorDetails(null);
    }
  }, [connections]);

  const handleGoogleConnection = async () => {
    try {
      setError(null);
      setErrorDetails(null);
      await initiateGoogleConnection();
    } catch (err: any) {
      setError(err.message || "Failed to connect to Google Ads");
      
      // Set more detailed error information if available
      if (err.message && err.message.includes("Admin needs to configure")) {
        setErrorDetails("Please ensure all required Google API credentials are set in Supabase");
      } else if (err.message && err.message.includes("Edge function error")) {
        setErrorDetails("There may be an issue with the Supabase Edge Function configuration");
      }
    }
  };

  const handleMetaConnection = async () => {
    try {
      setError(null);
      setErrorDetails(null);
      await initiateMetaConnection();
    } catch (err: any) {
      setError(err.message || "Failed to connect to Meta Ads");
      
      // Set more detailed error information if available
      if (err.message && err.message.includes("Admin needs to configure")) {
        setErrorDetails("Please ensure all required Meta API credentials are set in Supabase");
      } else if (err.message && err.message.includes("Edge function error")) {
        setErrorDetails("There may be an issue with the Supabase Edge Function configuration");
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
              {errorDetails && (
                <p className="mt-2 text-sm">{errorDetails}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Google Ads</h3>
              {connections.some(conn => conn.platform === "google") ? (
                connections
                  .filter(conn => conn.platform === "google")
                  .map(conn => (
                    <div key={conn.id} className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <p className="font-medium">Connected Account</p>
                        <p className="text-sm text-muted-foreground">
                          {conn.account_id === "unknown" || conn.account_id === "error-retrieving" ? (
                            <span className="flex items-center text-amber-500">
                              <AlertCircle size={14} className="mr-1" />
                              Unable to retrieve account details
                            </span>
                          ) : conn.account_id === "no-accounts" ? (
                            <span className="flex items-center text-amber-500">
                              <AlertCircle size={14} className="mr-1" />
                              No ad accounts found
                            </span>
                          ) : conn.account_id === "developer-token-missing" ? (
                            <span className="flex items-center text-amber-500">
                              <AlertCircle size={14} className="mr-1" />
                              Developer token missing
                            </span>
                          ) : (
                            `ID: ${conn.account_id}`
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeConnection(conn.id, "Google Ads")}
                        disabled={isConnecting}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))
              ) : (
                <div className="border p-4 rounded-md bg-muted/30 flex flex-col items-center justify-center">
                  <p className="text-muted-foreground mb-2">No Google Ads account connected</p>
                  <Button 
                    onClick={handleGoogleConnection} 
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                        Connecting...
                      </>
                    ) : (
                      'Connect Google Ads'
                    )}
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Meta Ads</h3>
              {connections.some(conn => conn.platform === "meta") ? (
                connections
                  .filter(conn => conn.platform === "meta")
                  .map(conn => (
                    <div key={conn.id} className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <p className="font-medium">Connected Account</p>
                        <p className="text-sm text-muted-foreground">
                          {conn.account_id === "unknown" || conn.account_id === "error-retrieving" ? (
                            <span className="flex items-center text-amber-500">
                              <AlertCircle size={14} className="mr-1" />
                              Unable to retrieve account details
                            </span>
                          ) : conn.account_id === "no-accounts" ? (
                            <span className="flex items-center text-amber-500">
                              <AlertCircle size={14} className="mr-1" />
                              No ad accounts found
                            </span>
                          ) : (
                            `ID: ${conn.account_id}`
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeConnection(conn.id, "Meta Ads")}
                        disabled={isConnecting}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))
              ) : (
                <div className="border p-4 rounded-md bg-muted/30 flex flex-col items-center justify-center">
                  <p className="text-muted-foreground mb-2">No Meta Ads account connected</p>
                  <Button 
                    onClick={handleMetaConnection}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                        Connecting...
                      </>
                    ) : (
                      'Connect Meta Ads'
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-md mt-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-2">About Ad Account Connections</h4>
                  <p className="text-sm text-muted-foreground">
                    Connecting your ad accounts allows Zero Agency Ad Guru to create and manage 
                    campaigns on your behalf. Your credentials are securely stored and you 
                    can disconnect your accounts at any time.
                  </p>
                  
                  {error && (
                    <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                      <h5 className="font-medium text-sm mb-1">Troubleshooting</h5>
                      <p className="text-xs text-muted-foreground">
                        If you're experiencing connection issues, please ensure that all required 
                        API credentials are properly configured in your Supabase project. This includes 
                        client ID, client secret, and any platform-specific tokens.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountConnections;

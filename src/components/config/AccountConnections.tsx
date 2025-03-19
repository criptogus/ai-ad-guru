
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAdAccountConnections } from "@/hooks/useAdAccountConnections";

const AccountConnections: React.FC = () => {
  const {
    connections,
    isLoading,
    initiateGoogleConnection,
    initiateMetaConnection,
    removeConnection,
    fetchConnections
  } = useAdAccountConnections();

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
          disabled={isLoading}
          title="Refresh connections"
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
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
                          ) : (
                            `ID: ${conn.account_id}`
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeConnection(conn.id, "Google Ads")}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))
              ) : (
                <div className="border p-4 rounded-md bg-muted/30 flex flex-col items-center justify-center">
                  <p className="text-muted-foreground mb-2">No Google Ads account connected</p>
                  <Button onClick={initiateGoogleConnection}>Connect Google Ads</Button>
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
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))
              ) : (
                <div className="border p-4 rounded-md bg-muted/30 flex flex-col items-center justify-center">
                  <p className="text-muted-foreground mb-2">No Meta Ads account connected</p>
                  <Button onClick={initiateMetaConnection}>Connect Meta Ads</Button>
                </div>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-md mt-6">
              <h4 className="font-medium mb-2">About Ad Account Connections</h4>
              <p className="text-sm text-muted-foreground">
                Connecting your ad accounts allows this application to create and manage 
                campaigns on your behalf. Your credentials are securely stored and you 
                can disconnect your accounts at any time.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountConnections;

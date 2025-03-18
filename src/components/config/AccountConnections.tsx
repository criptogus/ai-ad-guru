
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdAccountConnections } from "@/hooks/useAdAccountConnections";

const AccountConnections: React.FC = () => {
  const {
    connections,
    isLoading,
    initiateGoogleConnection,
    initiateMetaConnection,
    removeConnection
  } = useAdAccountConnections();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Platform Connections</CardTitle>
        <CardDescription>
          Connect your Google Ads and Meta Ads accounts to manage campaigns
        </CardDescription>
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
                        <p className="text-sm text-muted-foreground">{conn.account_id}</p>
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
                        <p className="text-sm text-muted-foreground">{conn.account_id}</p>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountConnections;

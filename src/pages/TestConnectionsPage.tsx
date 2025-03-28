
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { useConnectionTest } from "@/hooks/adConnections/useConnectionTest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConnectionTestCard from "@/components/testing/ConnectionTestCard";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";

const TestConnectionsPage: React.FC = () => {
  const { 
    isLoading, 
    connectionStatus, 
    statusDetails, 
    testConnection 
  } = useConnectionTest();

  const handleTestGoogleConnection = () => {
    testConnection('google');
  };

  return (
    <SafeAppLayout activePage="settings">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">API Connection Tests</h1>
          <Button variant="outline" onClick={handleTestGoogleConnection} disabled={isLoading.google}>
            {isLoading.google ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test Google Connection
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Google API Connection Status</CardTitle>
            <CardDescription>
              Test the connection to Google Ads API with your configured credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConnectionTestCard 
                platform="google"
                isLoading={isLoading.google}
                status={connectionStatus.google}
                statusDetails={statusDetails.google}
                onTest={() => testConnection('google')}
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle>API Credentials</CardTitle>
            <CardDescription>
              Current API credential configuration status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-muted">
                <h3 className="font-medium mb-2">Google Ads API</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-medium">Client ID:</span> {process.env.GOOGLE_CLIENT_ID ? "Configured" : "Not configured"}</li>
                  <li><span className="font-medium">Client Secret:</span> {process.env.GOOGLE_CLIENT_SECRET ? "Configured" : "Not configured"}</li>
                  <li><span className="font-medium">Developer Token:</span> {process.env.GOOGLE_DEVELOPER_TOKEN ? "Configured" : "Not configured"}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SafeAppLayout>
  );
};

export default TestConnectionsPage;

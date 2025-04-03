
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { googleAdsApi } from "@/services/ads/google/googleAdsApi";
import { testLinkedInCredentials } from "@/services/ads/linkedin/linkedInAdsConnector";
import { secureApi } from "@/services/api/secureApi";

const ConnectionDiagnostics: React.FC = () => {
  const [isTestingGoogle, setIsTestingGoogle] = useState(false);
  const [isTestingLinkedIn, setIsTestingLinkedIn] = useState(false);
  const [isTestingEdgeFunction, setIsTestingEdgeFunction] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<null | { success: boolean; message: string }>(null);
  const [linkedInStatus, setLinkedInStatus] = useState<null | { success: boolean; message: string }>(null);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<null | { success: boolean; message: string }>(null);

  const testGoogleConnection = async () => {
    setIsTestingGoogle(true);
    try {
      const result = await googleAdsApi.testCredentials();
      setGoogleStatus(result);
      toast(result.success ? "Google Ads test successful" : "Google Ads test failed", {
        description: result.message
      });
    } catch (error) {
      console.error("Error testing Google Ads connection:", error);
      setGoogleStatus({
        success: false,
        message: `Error: ${error.message || "Unknown error"}`
      });
      toast.error("Google Ads Test Error", {
        description: error.message || "An error occurred testing Google Ads connection"
      });
    } finally {
      setIsTestingGoogle(false);
    }
  };

  const testLinkedInConnection = async () => {
    setIsTestingLinkedIn(true);
    try {
      const result = await testLinkedInCredentials();
      setLinkedInStatus(result);
      toast(result.success ? "LinkedIn test successful" : "LinkedIn test failed", {
        description: result.message
      });
    } catch (error) {
      console.error("Error testing LinkedIn connection:", error);
      setLinkedInStatus({
        success: false,
        message: `Error: ${error.message || "Unknown error"}`
      });
      toast.error("LinkedIn Test Error", {
        description: error.message || "An error occurred testing LinkedIn connection"
      });
    } finally {
      setIsTestingLinkedIn(false);
    }
  };

  const testEdgeFunction = async () => {
    setIsTestingEdgeFunction(true);
    try {
      const result = await secureApi.invokeFunction('ad-account-test', { 
        platform: 'test',
        timestamp: new Date().toISOString()
      });
      
      setEdgeFunctionStatus({
        success: true,
        message: `Edge function responded successfully: ${JSON.stringify(result)}`
      });
      toast.success("Edge Function Test", {
        description: "The edge function responded successfully"
      });
    } catch (error) {
      console.error("Error testing edge function:", error);
      setEdgeFunctionStatus({
        success: false,
        message: `Error: ${error.message || "Unknown error"}`
      });
      toast.error("Edge Function Test Error", {
        description: error.message || "An error occurred testing the edge function"
      });
    } finally {
      setIsTestingEdgeFunction(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Connection Diagnostics</CardTitle>
        <CardDescription>
          Test your ad platform connections and API integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Google Ads API</h3>
                <p className="text-sm text-muted-foreground">Test Google Ads API connectivity</p>
              </div>
              {googleStatus && (
                <Badge variant={googleStatus.success ? "default" : "destructive"}>
                  {googleStatus.success ? "Success" : "Failed"}
                </Badge>
              )}
            </div>
            {googleStatus && (
              <div className="mb-4 text-sm p-2 bg-muted rounded-md">
                <p>{googleStatus.message}</p>
              </div>
            )}
            <Button 
              onClick={testGoogleConnection} 
              disabled={isTestingGoogle}
              variant="outline"
              className="w-full"
            >
              {isTestingGoogle ? "Testing..." : "Test Google Connection"}
            </Button>
          </div>

          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">LinkedIn API</h3>
                <p className="text-sm text-muted-foreground">Test LinkedIn API connectivity</p>
              </div>
              {linkedInStatus && (
                <Badge variant={linkedInStatus.success ? "default" : "destructive"}>
                  {linkedInStatus.success ? "Success" : "Failed"}
                </Badge>
              )}
            </div>
            {linkedInStatus && (
              <div className="mb-4 text-sm p-2 bg-muted rounded-md">
                <p>{linkedInStatus.message}</p>
              </div>
            )}
            <Button 
              onClick={testLinkedInConnection} 
              disabled={isTestingLinkedIn}
              variant="outline"
              className="w-full"
            >
              {isTestingLinkedIn ? "Testing..." : "Test LinkedIn Connection"}
            </Button>
          </div>

          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Edge Function</h3>
                <p className="text-sm text-muted-foreground">Test Supabase edge function connectivity</p>
              </div>
              {edgeFunctionStatus && (
                <Badge variant={edgeFunctionStatus.success ? "default" : "destructive"}>
                  {edgeFunctionStatus.success ? "Success" : "Failed"}
                </Badge>
              )}
            </div>
            {edgeFunctionStatus && (
              <div className="mb-4 text-sm p-2 bg-muted rounded-md">
                <p className="break-all">{edgeFunctionStatus.message}</p>
              </div>
            )}
            <Button 
              onClick={testEdgeFunction} 
              disabled={isTestingEdgeFunction}
              variant="outline"
              className="w-full"
            >
              {isTestingEdgeFunction ? "Testing..." : "Test Edge Function"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionDiagnostics;

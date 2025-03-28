
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { AdPlatform } from "@/hooks/adConnections/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConnectionTestCardProps {
  platform: AdPlatform;
  isLoading: boolean;
  status: 'untested' | 'success' | 'error';
  statusDetails: string;
  onTest: () => void;
}

const ConnectionTestCard: React.FC<ConnectionTestCardProps> = ({
  platform,
  isLoading,
  status,
  statusDetails,
  onTest
}) => {
  const platformName = 
    platform === 'google' ? 'Google Ads' : 
    platform === 'microsoft' ? 'Microsoft Ads' : 
    platform === 'meta' ? 'Meta Ads' : 'LinkedIn Ads';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{platformName} API Connection Test</CardTitle>
        <CardDescription>Verify your {platformName} API credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-muted">
            <h4 className="text-sm font-medium mb-2">Connection Status</h4>
            <div className="flex items-center">
              {status === 'untested' && (
                <span className="text-muted-foreground text-sm">Not tested yet</span>
              )}
              
              {status === 'success' && (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Connection successful</span>
                </div>
              )}
              
              {status === 'error' && (
                <div className="flex items-center text-destructive gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Connection failed</span>
                </div>
              )}
            </div>
            
            {statusDetails && (
              <div className={`mt-2 text-xs ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                {statusDetails}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onTest} 
                disabled={isLoading}
                className="w-full"
                variant="default"
              >
                {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Testing Connection...' : 'Test Connection'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sends a test request to verify API connectivity</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default ConnectionTestCard;

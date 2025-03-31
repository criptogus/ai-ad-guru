import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { AdPlatform } from "@/hooks/adConnections/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlatformConnectionCardProps {
  platform: AdPlatform;
  isConnecting: boolean;
  errorType: string | null;
  errorDetails: string | null;
  connections: any[];
  onConnect: () => void;
  onRemove: (id: string, platformName: string) => Promise<void>;
}

const PlatformConnectionCard: React.FC<PlatformConnectionCardProps> = ({
  platform,
  isConnecting,
  errorType,
  errorDetails,
  connections,
  onConnect,
  onRemove
}) => {
  const platformName = 
    platform === 'google' ? 'Google Ads' : 
    platform === 'microsoft' ? 'Microsoft Ads' : 
    platform === 'meta' ? 'Meta Ads' : 'LinkedIn Ads';

  const connection = connections.find(c => c.platform === platform);
  const isConnected = !!connection;
  const isLoading = isConnecting && errorType !== platform;

  const handleRemove = async () => {
    if (connection) {
      await onRemove(connection.id, platformName);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{platformName} Connection</CardTitle>
        <CardDescription>Connect your {platformName} account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-muted">
            <h4 className="text-sm font-medium mb-2">Connection Status</h4>
            <div className="flex items-center">
              {!isConnected && !isLoading && (
                <span className="text-muted-foreground text-sm">Not connected</span>
              )}
              {isConnected && (
                <div className="flex items-center text-green-600 dark:text-green-400 gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 gap-1">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Connecting...</span>
                </div>
              )}
              {errorType === platform && (
                <div className="flex items-center text-destructive gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Connection failed</span>
                </div>
              )}
            </div>
            {errorType === platform && errorDetails && (
              <div className="mt-2 text-xs text-destructive">{errorDetails}</div>
            )}
            {isConnected && connection?.accountName && (
              <div className="mt-2 text-xs text-muted-foreground">
                Account: {connection.accountName}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isConnected ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onConnect} 
                  disabled={isLoading}
                  className="w-full"
                  variant="default"
                >
                  {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Connecting...' : 'Connect'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connect your {platformName} ad account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleRemove} 
                  disabled={isLoading}
                  className="w-full"
                  variant="destructive"
                >
                  Disconnect
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Disconnect your {platformName} ad account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlatformConnectionCard;

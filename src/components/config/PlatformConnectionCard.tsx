
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react";
import { AdPlatform } from "@/hooks/adConnections/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlatformConnectionCardProps {
  platform: AdPlatform;
  isConnecting: boolean;
  connectingPlatform?: AdPlatform | null;
  errorType: string | null;
  errorDetails: string | null;
  connections: any[];
  onConnect: () => void;
  onRemove: (id: string, platformName: string) => Promise<void>;
}

const PlatformConnectionCard: React.FC<PlatformConnectionCardProps> = ({
  platform,
  isConnecting,
  connectingPlatform,
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
  
  // Only show loading for the specific platform that's connecting
  const isLoading = isConnecting && connectingPlatform === platform;
  const hasError = errorType === platform;

  // Developer console links for different platforms
  const developerConsoleLink = 
    platform === 'google' ? 'https://console.cloud.google.com/apis/credentials' :
    platform === 'microsoft' ? 'https://ads.microsoft.com/customer-management/apiaccess' :
    platform === 'meta' ? 'https://developers.facebook.com/apps/' :
    platform === 'linkedin' ? 'https://www.linkedin.com/developers/apps' : null;

  // Platform-specific help text for common errors
  const getErrorHelp = () => {
    if (!errorDetails) return null;
    
    if (platform === 'linkedin') {
      if (errorDetails.includes('Marketing Developer Platform')) {
        return (
          <div className="mt-2 text-xs">
            <p>LinkedIn requires Marketing Developer Platform approval for ad management.</p>
            <a 
              href="https://www.linkedin.com/developers/apps" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline inline-flex items-center mt-1"
            >
              <span>Check app permissions</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        );
      }
      if (errorDetails.includes('redirect_uri_mismatch') || errorDetails.includes('invalid redirect')) {
        return (
          <div className="mt-2 text-xs">
            <p>Redirect URI must exactly match what's registered in LinkedIn.</p>
          </div>
        );
      }
    }
    
    return null;
  };

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
              {hasError && (
                <div className="flex items-center text-destructive gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Connection failed</span>
                </div>
              )}
            </div>
            {hasError && errorDetails && (
              <div className="mt-2 text-xs text-destructive">{errorDetails}</div>
            )}
            {hasError && getErrorHelp()}
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
      
      {developerConsoleLink && (
        <div className="px-6 pb-4 text-xs">
          <a 
            href={developerConsoleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline inline-flex items-center"
          >
            <span>Open {platformName} Developer Console</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      )}
    </Card>
  );
};

export default PlatformConnectionCard;

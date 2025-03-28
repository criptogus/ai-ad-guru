
import React from "react";
import { Connection } from "@/hooks/adConnections/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Goal, Facebook, Linkedin, ServerIcon, ShieldCheck, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

interface PlatformConnectionCardProps {
  platform: 'google' | 'meta' | 'linkedin' | 'microsoft';
  isConnecting: boolean;
  errorType: string | null;
  errorDetails: string | null;
  connections: Connection[];
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
  const platformConnection = connections.find(conn => conn.platform === platform);
  const isConnected = !!platformConnection;
  const isError = errorType === platform;

  // Security enhancement: Don't show exact connection time to reduce information leakage
  const getConnectionTime = (timestamp?: string) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  // Platform-specific configurations
  const platformConfigs = {
    google: {
      name: "Google Ads",
      icon: <Goal className="h-10 w-10 text-primary" />,
      connectText: "Connect Google Ads",
      disconnectText: "Disconnect Google Ads",
    },
    meta: {
      name: "Meta Ads",
      icon: <Facebook className="h-10 w-10 text-primary" />,
      connectText: "Connect Meta Ads",
      disconnectText: "Disconnect Meta Ads",
    },
    linkedin: {
      name: "LinkedIn Ads",
      icon: <Linkedin className="h-10 w-10 text-primary" />,
      connectText: "Connect LinkedIn Ads",
      disconnectText: "Disconnect LinkedIn Ads",
    },
    microsoft: {
      name: "Microsoft Ads",
      icon: <ServerIcon className="h-10 w-10 text-primary" />,
      connectText: "Connect Microsoft Ads",
      disconnectText: "Disconnect Microsoft Ads",
    }
  };

  const config = platformConfigs[platform];

  return (
    <Card className="relative overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex items-center justify-center py-6 space-y-1">
        {config.icon}
        <h3 className="text-lg font-medium">{config.name}</h3>
      </CardHeader>
      <CardContent className="text-center pb-2">
        {isConnected ? (
          <div>
            <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 font-medium mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Securely Connected</span>
            </div>
            {platformConnection.account_id && (
              <p className="text-xs text-muted-foreground mt-1">
                Account: {platformConnection.account_id.substring(0, 6)}...
              </p>
            )}
            {platformConnection.updated_at && (
              <p className="text-xs text-muted-foreground">
                Connected {getConnectionTime(platformConnection.updated_at)}
              </p>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground font-medium">
            Not connected
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-2 pb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isConnected ? (
                <Button 
                  variant="outline" 
                  onClick={() => onRemove(platformConnection.id, platform)}
                  className="border-destructive hover:border-destructive/90 hover:bg-destructive/10 text-destructive"
                  disabled={isConnecting}
                >
                  {config.disconnectText}
                </Button>
              ) : (
                <Button 
                  onClick={onConnect}
                  disabled={isConnecting}
                  variant="default"
                >
                  {isConnecting && errorType === platform ? "Connecting..." : config.connectText}
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-popover text-popover-foreground">
              {isConnected ? (
                <p className="text-sm px-1">Revokes all access tokens and permissions</p>
              ) : (
                <div className="flex items-center gap-1.5 text-sm px-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <p>Securely connect via OAuth 2.0</p>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
      {isError && (
        <div className="absolute inset-0 bg-destructive/5 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card p-4 rounded-lg shadow-lg max-w-xs border border-border">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <h4 className="font-bold text-destructive">Connection Error</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{errorDetails || "There was a problem connecting to the ad platform. Please try again."}</p>
            <Button size="sm" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PlatformConnectionCard;

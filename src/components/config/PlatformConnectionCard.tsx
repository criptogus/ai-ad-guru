
import React from "react";
import { Connection } from "@/hooks/adConnections/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Goal, Facebook, Linkedin, Microsoft } from "lucide-react";

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

  // Platform-specific configurations
  const platformConfigs = {
    google: {
      name: "Google Ads",
      icon: <Goal className="h-10 w-10 text-blue-500" />,
      connectText: "Connect Google Ads",
      disconnectText: "Disconnect Google Ads",
    },
    meta: {
      name: "Meta Ads",
      icon: <Facebook className="h-10 w-10 text-blue-600" />,
      connectText: "Connect Meta Ads",
      disconnectText: "Disconnect Meta Ads",
    },
    linkedin: {
      name: "LinkedIn Ads",
      icon: <Linkedin className="h-10 w-10 text-blue-700" />,
      connectText: "Connect LinkedIn Ads",
      disconnectText: "Disconnect LinkedIn Ads",
    },
    microsoft: {
      name: "Microsoft Ads",
      icon: <Microsoft className="h-10 w-10 text-blue-500" />,
      connectText: "Connect Microsoft Ads",
      disconnectText: "Disconnect Microsoft Ads",
    }
  };

  const config = platformConfigs[platform];

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex items-center justify-center py-6">
        {config.icon}
        <h3 className="text-lg font-medium mt-2">{config.name}</h3>
      </CardHeader>
      <CardContent className="text-center pb-2">
        {isConnected ? (
          <div className="text-sm text-green-600 font-medium">
            Connected
            {platformConnection.account_id && (
              <p className="text-xs text-gray-500 mt-1">Account: {platformConnection.account_id}</p>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 font-medium">
            Not connected
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-2 pb-6">
        {isConnected ? (
          <Button 
            variant="outline" 
            onClick={() => onRemove(platformConnection.id, platform)}
            className="border-red-300 hover:border-red-600 hover:bg-red-50 text-red-600"
            disabled={isConnecting}
          >
            {config.disconnectText}
          </Button>
        ) : (
          <Button 
            onClick={onConnect}
            disabled={isConnecting}
          >
            {isConnecting && errorType === platform ? "Connecting..." : config.connectText}
          </Button>
        )}
      </CardFooter>
      {isError && (
        <div className="absolute inset-0 bg-red-100/90 dark:bg-red-900/90 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs">
            <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Connection Error</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{errorDetails}</p>
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

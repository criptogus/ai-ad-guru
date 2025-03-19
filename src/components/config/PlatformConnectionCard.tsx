
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Globe, Goal } from "lucide-react";
import { Connection } from "@/hooks/adConnections/types";

interface PlatformConnectionCardProps {
  platform: 'google' | 'linkedin' | 'microsoft';
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
  onRemove,
}) => {
  const getPlatformDetails = (platform: string) => {
    switch (platform) {
      case 'google':
        return {
          title: 'Google Ads',
          description: 'Connect your Google Ads account to create and manage campaigns',
          icon: Goal, // Using Goal icon instead of GoogleIcon which doesn't exist
        };
      case 'linkedin':
        return {
          title: 'LinkedIn Ads',
          description: 'Connect your LinkedIn Ads account to create and manage campaigns',
          icon: Globe,
        };
      case 'microsoft':
        return {
          title: 'Microsoft Ads',
          description: 'Connect your Microsoft Ads account to create and manage campaigns',
          icon: Globe,
        };
      default:
        return {
          title: platform,
          description: 'Connect your account',
          icon: Globe,
        };
    }
  };

  const platformDetails = getPlatformDetails(platform);
  const Icon = platformDetails.icon;
  const platformConnections = connections.filter(conn => conn.platform === platform);
  const isConnected = platformConnections.length > 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg font-semibold">{platformDetails.title}</CardTitle>
          <CardDescription>{platformDetails.description}</CardDescription>
        </div>
        <Icon size={22} />
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-2">
            {platformConnections.map((connection) => (
              <div key={connection.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Account ID: {connection.account_id}</span>
                  <span className="text-xs text-muted-foreground">Connected on {new Date(connection.created_at).toLocaleDateString()}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemove(connection.id, platformDetails.title)}
                >
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Button onClick={onConnect} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : `Connect ${platformDetails.title}`}
            </Button>
          </div>
        )}
      </CardContent>
      {errorType && (
        <CardFooter className="bg-destructive/10 p-3">
          <div className="text-sm text-destructive">
            <p className="font-semibold">{errorType === 'credentials' ? 'Configuration Error' : 'Connection Error'}</p>
            <p>{errorDetails}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PlatformConnectionCard;

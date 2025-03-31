
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import { Connection, AdPlatform } from "@/hooks/adConnections/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PlatformIcon from "./PlatformIcon";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PlatformConnectionCardProps {
  platform: AdPlatform;
  isConnecting: boolean;
  errorType?: string | null;
  errorDetails?: string | null;
  connections: Connection[];
  onConnect: () => void;
  onRemove: (id: string, platformName: string) => void;
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
  const platformConnection = connections.find(c => c.platform === platform);
  
  const platformName = 
    platform === 'google' ? 'Google Ads' : 
    platform === 'meta' ? 'Meta Ads' : 
    platform === 'linkedin' ? 'LinkedIn Ads' : 'Microsoft Ads';
    
  const isError = errorType === platform;
  
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${isError ? 'border-destructive/50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${platformConnection ? 'bg-primary/10' : 'bg-muted'}`}>
              <PlatformIcon platform={platform} size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium">{platformName}</h3>
              <p className="text-sm text-muted-foreground">
                {platformConnection 
                  ? `Connected ${platformConnection.accountName ? `(${platformConnection.accountName})` : ''}` 
                  : `Connect your ${platformName} account`}
              </p>
            </div>
          </div>
          
          {platformConnection && (
            <Badge variant="outline" className="text-xs border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
        
        {isError && errorDetails && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-md border border-destructive/20 text-destructive text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{errorDetails}</span>
            </div>
          </div>
        )}
        
        {platformConnection && (
          <div className="mt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Account ID:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                      {platformConnection.accountId || 'Unknown'}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{platform === 'google' ? 'Google Ads account ID' : 'Account identifier'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {platformConnection.metadata?.developerToken && platform === 'google' && (
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <span>Developer token:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                        {'✓ Valid'}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Developer token is configured</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-6 pt-0">
        {!platformConnection ? (
          <Button 
            className="w-full" 
            disabled={isConnecting} 
            onClick={onConnect}
          >
            {isConnecting && platform === errorType ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            {isConnecting && platform === errorType ? 'Connecting...' : `Connect ${platformName}`}
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => onRemove(platformConnection.id, platformName)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
            
            {platform === 'google' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="secondary"
                      size="icon"
                      asChild
                    >
                      <a 
                        href="https://ads.google.com/aw/overview" 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open Google Ads dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlatformConnectionCard;

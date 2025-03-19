
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Connection } from "@/hooks/adConnections/types";

interface PlatformConnectionCardProps {
  platform: "google" | "meta";
  platformDisplayName: string;
  connections: Connection[];
  isConnecting: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: (id: string, platformName: string) => Promise<void>;
}

const PlatformConnectionCard: React.FC<PlatformConnectionCardProps> = ({
  platform,
  platformDisplayName,
  connections,
  isConnecting,
  onConnect,
  onDisconnect,
}) => {
  const platformConnections = connections.filter((conn) => conn.platform === platform);
  const isConnected = platformConnections.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{platformDisplayName}</h3>
      {isConnected ? (
        platformConnections.map((conn) => (
          <div key={conn.id} className="flex items-center justify-between border p-3 rounded-md">
            <div>
              <p className="font-medium">Connected Account</p>
              <p className="text-sm text-muted-foreground">
                {conn.account_id === "unknown" || conn.account_id === "error-retrieving" ? (
                  <span className="flex items-center text-amber-500">
                    <AlertCircle size={14} className="mr-1" />
                    Unable to retrieve account details
                  </span>
                ) : conn.account_id === "no-accounts" ? (
                  <span className="flex items-center text-amber-500">
                    <AlertCircle size={14} className="mr-1" />
                    No ad accounts found
                  </span>
                ) : conn.account_id === "developer-token-missing" ? (
                  <span className="flex items-center text-amber-500">
                    <AlertCircle size={14} className="mr-1" />
                    Developer token missing
                  </span>
                ) : (
                  `ID: ${conn.account_id}`
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDisconnect(conn.id, `${platformDisplayName}`)}
              disabled={isConnecting}
            >
              Disconnect
            </Button>
          </div>
        ))
      ) : (
        <div className="border p-4 rounded-md bg-muted/30 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-2">No {platformDisplayName} account connected</p>
          <Button onClick={onConnect} disabled={isConnecting}>
            {isConnecting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                Connecting...
              </>
            ) : (
              `Connect ${platformDisplayName}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlatformConnectionCard;

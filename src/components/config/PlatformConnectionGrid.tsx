
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PlatformConnectionCard from "./PlatformConnectionCard";
import { AdPlatform } from "@/hooks/adConnections/types";

interface PlatformConnectionGridProps {
  connections: any[];
  isConnecting: boolean;
  connectingPlatform?: AdPlatform | null;
  errorType: string | null;
  errorDetails: string | null;
  onConnectGoogle: () => void;
  onConnectMeta: () => void;
  onConnectLinkedIn: () => void;
  onConnectMicrosoft: () => void;
  onRemove: (id: string, platformName: string) => Promise<void>;
}

const PlatformConnectionGrid: React.FC<PlatformConnectionGridProps> = ({
  connections,
  isConnecting,
  connectingPlatform,
  errorType,
  errorDetails,
  onConnectGoogle,
  onConnectMeta,
  onConnectLinkedIn,
  onConnectMicrosoft,
  onRemove
}) => {
  const navigate = useNavigate();
  const hasAtLeastOneConnection = connections.length > 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PlatformConnectionCard
          platform="google"
          isConnecting={isConnecting}
          connectingPlatform={connectingPlatform}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={onConnectGoogle}
          onRemove={onRemove}
        />

        <PlatformConnectionCard
          platform="meta"
          isConnecting={isConnecting}
          connectingPlatform={connectingPlatform}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={onConnectMeta}
          onRemove={onRemove}
        />

        <PlatformConnectionCard
          platform="linkedin"
          isConnecting={isConnecting}
          connectingPlatform={connectingPlatform}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={onConnectLinkedIn}
          onRemove={onRemove}
        />

        <PlatformConnectionCard
          platform="microsoft"
          isConnecting={isConnecting}
          connectingPlatform={connectingPlatform}
          errorType={errorType}
          errorDetails={errorDetails}
          connections={connections}
          onConnect={onConnectMicrosoft}
          onRemove={onRemove}
        />
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button 
          size="lg"
          onClick={() => navigate('/campaign/create')}
          disabled={!hasAtLeastOneConnection}
        >
          {hasAtLeastOneConnection ? 'Continue to Ad Creation' : 'Connect at least one platform'}
        </Button>
      </div>
    </>
  );
};

export default PlatformConnectionGrid;


import React from "react";
import { useAdAccountConnections } from "@/hooks/adConnections";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import SecurityInfoCard from "./SecurityInfoCard";
import ConnectionErrorDisplay from "./ConnectionErrorDisplay";
import PlatformConnectionGrid from "./PlatformConnectionGrid";

const ConnectionsSection: React.FC = () => {
  const { user } = useAuth();
  const {
    connections,
    isLoading,
    isConnecting,
    connectingPlatform,
    error,
    errorDetails,
    errorType,
    fetchConnections,
    initiateGoogleConnection,
    initiateLinkedInConnection,
    initiateMicrosoftConnection,
    initiateMetaConnection,
    removeConnection
  } = useAdAccountConnections();

  // Security enhancement: Show toast on successful connection status fetch
  React.useEffect(() => {
    if (connections.length > 0 && !isLoading) {
      toast.success("Connection status verified securely", {
        id: "connection-status",
        duration: 2000,
      });
    }
  }, [connections, isLoading]);

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Connect Your Ad Accounts</h2>
        
        {/* Security badge */}
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure OAuth 2.0</span>
        </div>
      </div>
      
      <ConnectionErrorDisplay 
        error={error} 
        errorDetails={errorDetails} 
        errorType={errorType} 
      />

      <SecurityInfoCard />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PlatformConnectionGrid
          connections={connections}
          isConnecting={isConnecting}
          connectingPlatform={connectingPlatform}
          errorType={errorType}
          errorDetails={errorDetails}
          onConnectGoogle={initiateGoogleConnection}
          onConnectMeta={initiateMetaConnection}
          onConnectLinkedIn={initiateLinkedInConnection}
          onConnectMicrosoft={initiateMicrosoftConnection}
          onRemove={removeConnection}
        />
      )}
    </div>
  );
};

export default ConnectionsSection;

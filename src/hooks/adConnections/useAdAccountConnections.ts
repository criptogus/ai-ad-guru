
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Connection, AdConnectionsState, AdConnectionsActions } from './types';
import { fetchUserConnections, removeUserConnection } from './connectionService';
import { useOAuthCallback } from './useOAuthCallback';
import { useConnectionInitiation } from './useConnectionInitiation';

export const useAdAccountConnections = (): AdConnectionsState & AdConnectionsActions => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use our new custom hooks
  const { 
    isConnecting: isOAuthConnecting,
    error: oauthError,
    errorDetails: oauthErrorDetails,
    errorType: oauthErrorType,
    processOAuthCallback 
  } = useOAuthCallback();

  const {
    isConnecting: isInitiating,
    error: initiationError,
    errorDetails: initiationErrorDetails,
    errorType: initiationErrorType,
    handleConnectionInitiation
  } = useConnectionInitiation();

  // Combined states for the public API
  const isConnecting = isOAuthConnecting || isInitiating;
  const error = oauthError || initiationError;
  const errorDetails = oauthErrorDetails || initiationErrorDetails;
  const errorType = oauthErrorType || initiationErrorType;

  const fetchConnections = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Clear errors when fetching new connections
      
      const data = await fetchUserConnections(user.id);
      setConnections(data);
    } catch (error: any) {
      console.error("Error fetching connections:", error);
      toast({
        title: "Failed to load connections",
        description: error.message || "There was an error loading your ad platform connections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeConnection = async (id: string, platformName: string) => {
    if (!user) return;
    
    try {
      await removeUserConnection(id, user.id);
      
      // Update local state
      setConnections(connections.filter(conn => conn.id !== id));
      
      toast({
        title: "Connection Removed",
        description: `Your ${platformName} account has been disconnected`,
      });
    } catch (error: any) {
      console.error("Error removing connection:", error);
      toast({
        title: "Failed to remove connection",
        description: error.message || "There was an error disconnecting your account",
        variant: "destructive",
      });
    }
  };

  // Check for OAuth callback when the component mounts
  useEffect(() => {
    if (user) {
      processOAuthCallback(user.id, fetchConnections);
      fetchConnections();
    }
  }, [user]);

  return {
    connections,
    isLoading,
    isConnecting,
    error,
    errorDetails,
    errorType,
    fetchConnections,
    initiateGoogleConnection: () => handleConnectionInitiation('google', user?.id),
    initiateLinkedInConnection: () => handleConnectionInitiation('linkedin', user?.id),
    initiateMicrosoftConnection: () => handleConnectionInitiation('microsoft', user?.id),
    initiateMetaConnection: () => handleConnectionInitiation('meta', user?.id),
    removeConnection
  };
};


import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Connection, AdConnectionsState, AdConnectionsActions } from './types';
import { fetchUserConnections, removeUserConnection } from './connectionService';
import { initiateOAuth, handleOAuthCallback, isOAuthCallback } from './oauthService';

export const useAdAccountConnections = (): AdConnectionsState & AdConnectionsActions => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchConnections = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await fetchUserConnections(user.id);
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast({
        title: "Failed to load connections",
        description: "There was an error loading your ad platform connections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectionInitiation = async (platform: 'google' | 'meta') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your ad accounts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsConnecting(true);
      
      toast({
        title: `${platform === 'google' ? 'Google' : 'Meta'} Ads Connection`,
        description: "Initializing OAuth connection...",
      });
      
      // Prepare redirect URI - make sure it's the current origin plus the path
      const redirectUri = `${window.location.origin}/config`;
      
      // Get the OAuth URL and redirect the user
      const authUrl = await initiateOAuth({
        platform,
        userId: user.id,
        redirectUri
      });
      
      // Redirect the user to the OAuth consent screen
      console.log(`Redirecting to OAuth URL: ${authUrl}`);
      window.location.href = authUrl;
      
    } catch (error: any) {
      console.error(`Error connecting to ${platform} Ads:`, error);
      toast({
        title: "Connection Failed",
        description: `${error.message}`,
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const processOAuthCallback = async () => {
    if (!isOAuthCallback() || !user) return;
    
    try {
      setIsConnecting(true);
      
      // Prepare redirect URI - use the same one we used for the initial request
      const redirectUri = `${window.location.origin}/config`;
      
      const result = await handleOAuthCallback(redirectUri);
      
      if (result) {
        // Refresh the connections list
        await fetchConnections();
        
        toast({
          title: "Account Connected",
          description: `Successfully connected to ${result.platform === 'google' ? 'Google' : 'Meta'} Ads`,
        });
      }
    } catch (error: any) {
      console.error('Error completing OAuth flow:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "There was an error connecting your account",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
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
    } catch (error) {
      console.error("Error removing connection:", error);
      toast({
        title: "Failed to remove connection",
        description: "There was an error disconnecting your account",
        variant: "destructive",
      });
    }
  };

  // Check for OAuth callback when the component mounts
  useEffect(() => {
    if (user) {
      processOAuthCallback();
      fetchConnections();
    }
  }, [user]);

  return {
    connections,
    isLoading,
    isConnecting,
    fetchConnections,
    initiateGoogleConnection: () => handleConnectionInitiation('google'),
    initiateMetaConnection: () => handleConnectionInitiation('meta'),
    removeConnection
  };
};

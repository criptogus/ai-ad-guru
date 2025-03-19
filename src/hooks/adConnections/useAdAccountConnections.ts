
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
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const fetchConnections = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      const data = await fetchUserConnections(user.id);
      setConnections(data);
    } catch (error: any) {
      console.error("Error fetching connections:", error);
      toast({
        title: "Failed to load connections",
        description: error.message || "There was an error loading your ad platform connections",
        variant: "destructive",
      });
      
      setError("Failed to load connections");
      setErrorDetails(error.message || "There was an error loading your ad platform connections");
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
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      toast({
        title: `${platform === 'google' ? 'Google' : 'Meta'} Ads Connection`,
        description: "Initializing connection...",
      });
      
      // Prepare redirect URI - make sure it's the current origin plus the path
      const redirectUri = `${window.location.origin}/config`;
      
      console.log(`Starting OAuth flow with redirect URI: ${redirectUri}`);
      
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
        description: error.message || `Failed to connect to ${platform} Ads`,
        variant: "destructive",
      });
      
      setError(error.message || `Failed to connect to ${platform} Ads`);
      
      // Set more detailed error information if available
      if (error.message && error.message.includes("Admin needs to configure")) {
        setErrorType("credentials");
        setErrorDetails(`Please ensure all required ${platform} API credentials are set in Supabase Edge Function secrets.`);
      } else if (error.message && error.message.includes("Edge function error")) {
        setErrorType("edge_function");
        setErrorDetails("There may be an issue with the Supabase Edge Function configuration. Check the Edge Function logs for more details.");
      } else if (error.message && error.message.includes("non-2xx status")) {
        setErrorType("edge_function");
        setErrorDetails(`The Supabase Edge Function returned an error. Verify that all ${platform} API credentials are properly configured in the Edge Function secrets and that the function is correctly deployed.`);
      }
      
      setIsConnecting(false);
      throw error; // Re-throw for component to handle
    }
  };

  const processOAuthCallback = async () => {
    if (!isOAuthCallback() || !user) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // Prepare redirect URI - use the same one we used for the initial request
      const redirectUri = `${window.location.origin}/config`;
      
      console.log(`Processing OAuth callback with redirect URI: ${redirectUri}`);
      
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
      
      setError(error.message || "There was an error connecting your account");
      
      // Set more detailed error information
      if (error.message && error.message.includes("token")) {
        setErrorType("credentials");
        setErrorDetails("There was an error exchanging the authorization code for tokens. This could be due to misconfigured credentials or redirect URIs.");
      } else if (error.message && error.message.includes("Invalid") || error.message.includes("expired")) {
        setErrorType("credentials");
        setErrorDetails("The authorization response was invalid or expired. Please try connecting again.");
      } else {
        setErrorType("edge_function");
        setErrorDetails("There was an error completing the OAuth flow. Check the Edge Function logs for more details.");
      }
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
      processOAuthCallback();
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
    initiateGoogleConnection: () => handleConnectionInitiation('google'),
    initiateMetaConnection: () => handleConnectionInitiation('meta'),
    removeConnection
  };
};

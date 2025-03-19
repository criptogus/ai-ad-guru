
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Connection {
  id: string;
  platform: string;
  account_id: string;
  created_at: string;
}

export const useAdAccountConnections = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("user_integrations")
        .select("id, platform, account_id, created_at")
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setConnections(data || []);
      
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

  const initiateOAuth = async (platform: 'google' | 'meta') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your ad accounts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: `${platform === 'google' ? 'Google' : 'Meta'} Ads Connection`,
        description: "Initializing OAuth connection...",
      });
      
      // Generate the OAuth URL from our edge function
      const { data, error } = await supabase.functions.invoke('ad-account-auth', {
        body: {
          action: 'getAuthUrl',
          platform,
          redirectUri: window.location.origin + '/config',
          userId: user.id
        }
      });
      
      if (error || !data.success || !data.authUrl) {
        throw new Error(error || data.error || 'Failed to initialize OAuth flow');
      }
      
      // Store that we're in the middle of an OAuth flow
      sessionStorage.setItem('adPlatformAuth', JSON.stringify({
        platform,
        inProgress: true,
        userId: user.id
      }));
      
      // Redirect the user to the OAuth consent screen
      window.location.href = data.authUrl;
      
    } catch (error: any) {
      console.error(`Error connecting to ${platform} Ads:`, error);
      toast({
        title: "Connection Failed",
        description: `There was an error connecting to ${platform === 'google' ? 'Google' : 'Meta'} Ads: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleOAuthCallback = async () => {
    // Check if we're coming back from an OAuth redirect
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    // Clean up the URL
    if (code || error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      toast({
        title: "Connection Failed",
        description: `Authorization denied or cancelled: ${error}`,
        variant: "destructive",
      });
      return;
    }
    
    // Retrieve stored OAuth flow data
    const storedAuthData = sessionStorage.getItem('adPlatformAuth');
    if (!code || !state || !storedAuthData) return;
    
    try {
      const authData = JSON.parse(storedAuthData);
      const { platform, userId } = authData;
      
      if (!platform || !userId || userId !== user?.id) {
        throw new Error('Invalid OAuth session data');
      }
      
      // Clear the stored OAuth data
      sessionStorage.removeItem('adPlatformAuth');
      
      toast({
        title: `${platform === 'google' ? 'Google' : 'Meta'} Ads Connection`,
        description: "Completing connection...",
      });
      
      // Exchange the code for tokens
      const { data, error } = await supabase.functions.invoke('ad-account-auth', {
        body: {
          action: 'exchangeToken',
          code,
          state,
          platform,
          redirectUri: window.location.origin + '/config',
          userId
        }
      });
      
      if (error || !data.success) {
        throw new Error(error || data.error || 'Failed to complete connection');
      }
      
      // Refresh the connections list
      await fetchConnections();
      
      toast({
        title: "Account Connected",
        description: `Successfully connected to ${platform === 'google' ? 'Google' : 'Meta'} Ads`,
      });
      
    } catch (error: any) {
      console.error('Error completing OAuth flow:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "There was an error connecting your account",
        variant: "destructive",
      });
    }
  };

  const removeConnection = async (id: string, platform: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("user_integrations")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }
      
      // Update local state
      setConnections(connections.filter(conn => conn.id !== id));
      
      toast({
        title: "Connection Removed",
        description: `Your ${platform} account has been disconnected`,
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
      handleOAuthCallback();
      fetchConnections();
    }
  }, [user]);

  return {
    connections,
    isLoading,
    fetchConnections,
    initiateGoogleConnection: () => initiateOAuth('google'),
    initiateMetaConnection: () => initiateOAuth('meta'),
    removeConnection
  };
};

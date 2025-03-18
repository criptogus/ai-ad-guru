
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
        .select("*")
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
    if (!user) return;
    
    // In a real implementation, we would redirect to an OAuth URL
    // For now, we'll simulate the OAuth flow
    
    try {
      toast({
        title: `${platform === 'google' ? 'Google' : 'Meta'} Ads Connection`,
        description: "Simulating OAuth connection...",
      });
      
      // Simulate OAuth flow completion
      const { data, error } = await supabase.functions.invoke('ad-account-auth', {
        body: {
          platform,
          code: 'simulated_code',
          redirectUri: window.location.origin + '/config',
          userId: user.id
        }
      });
      
      if (error || !data.success) {
        throw new Error(error || data.error || 'Failed to connect account');
      }
      
      toast({
        title: "Account Connected",
        description: `Successfully connected to ${platform === 'google' ? 'Google' : 'Meta'} Ads`,
      });
      
      // Refresh the connections list
      fetchConnections();
      
    } catch (error) {
      console.error(`Error connecting to ${platform} Ads:`, error);
      toast({
        title: "Connection Failed",
        description: `There was an error connecting to ${platform === 'google' ? 'Google' : 'Meta'} Ads`,
        variant: "destructive",
      });
    }
  };

  const removeConnection = async (id: string, platform: string) => {
    try {
      const { error } = await supabase
        .from("user_integrations")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

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

  useEffect(() => {
    if (user) {
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

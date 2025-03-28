
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdPlatform } from './types';
import { tokenSecurity } from '@/services/security/tokenSecurity';

export const useConnectionInitiation = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const handleConnectionInitiation = async (platform: AdPlatform, userId: string | undefined) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to connect ad accounts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // Prepare redirect URI - use the current page to handle the callback
      const redirectUri = `${window.location.origin}/config`;
      console.log(`Starting ${platform} connection with redirect URI: ${redirectUri}`);
      
      // Log connection attempt for security purposes
      await tokenSecurity.logSecurityEvent({
        event: 'oauth_initiated',
        user_id: userId,
        platform,
        timestamp: new Date().toISOString(),
        details: {
          origin: window.location.origin,
          redirectUri
        }
      });
      
      // Call edge function to get auth URL
      const response = await supabase.functions.invoke('ad-account-auth', {
        body: {
          action: 'getAuthUrl',
          platform,
          userId,
          redirectUri
        }
      });
      
      console.log('Edge function response:', response);
      
      if (response.error) {
        console.error(`Error initiating ${platform} connection:`, response.error);
        
        let errorMessage = `Failed to connect to ${platform}: ${response.error.message || 'Unknown error'}`;
        let errorType = 'edge_function';
        let errorDetails = response.error.message || null;
        
        setError(errorMessage);
        setErrorType(errorType);
        setErrorDetails(errorDetails);
        
        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return;
      }
      
      const data = response.data;
      
      if (!data || !data.success || !data.authUrl) {
        const errorMessage = data?.error || `Failed to get valid auth URL for ${platform}`;
        console.error(errorMessage, data);
        
        setError(errorMessage);
        setErrorType('invalid_response');
        setErrorDetails('The server response did not contain a valid authorization URL');
        
        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return;
      }
      
      // Redirect to the authorization URL
      console.log(`Redirecting to ${platform} auth URL:`, data.authUrl);
      window.location.href = data.authUrl;
    } catch (error: any) {
      console.error(`Error in ${platform} connection initiation:`, error);
      
      setError(error.message || `Failed to connect to ${platform}`);
      setErrorType('client');
      setErrorDetails(error.toString());
      
      toast({
        title: "Connection Error",
        description: error.message || `Failed to connect to ${platform}`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isConnecting,
    error,
    errorDetails,
    errorType,
    handleConnectionInitiation,
    clearErrors: () => {
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
    }
  };
};

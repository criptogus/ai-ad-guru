
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isOAuthCallback, handleOAuthCallback } from './oauthService';

export const useOAuthCallback = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const processOAuthCallback = async (userId: string | undefined, fetchConnections: () => Promise<void>) => {
    if (!isOAuthCallback() || !userId) return;
    
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

  return {
    isConnecting,
    error,
    errorDetails,
    errorType,
    processOAuthCallback,
    clearErrors: () => {
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
    }
  };
};

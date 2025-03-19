
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initiateOAuth } from './oauthService';
import { AdPlatform } from './types';

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
        title: `${platform === 'google' ? 'Google' : platform === 'linkedin' ? 'LinkedIn' : 'Microsoft'} Ads Connection`,
        description: "Initializing connection...",
      });
      
      // Prepare redirect URI - make sure it's the current origin plus the path
      const redirectUri = `${window.location.origin}/config`;
      
      console.log(`Starting OAuth flow with redirect URI: ${redirectUri}`);
      
      // Get the OAuth URL and redirect the user
      const authUrl = await initiateOAuth({
        platform,
        userId,
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

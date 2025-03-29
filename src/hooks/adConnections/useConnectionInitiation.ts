
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initiateOAuth } from './oauth';

export const useConnectionInitiation = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const handleConnectionInitiation = async (platform: string, userId: string | undefined) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to connect an ad account",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setError(null);
    setErrorDetails(null);
    setErrorType(null);

    try {
      // Prepare redirect URI - this should match what's configured in the ad platform
      const redirectUri = `${window.location.origin}/config`;
      
      // Initiate OAuth flow for the platform
      const authUrl = await initiateOAuth({
        platform: platform as any,
        userId,
        redirectUri
      });
      
      if (authUrl) {
        console.log(`Redirecting to ${platform} auth URL:`, authUrl);
        // Redirect to the OAuth URL
        window.location.href = authUrl;
      } else {
        throw new Error(`Failed to get authentication URL for ${platform}`);
      }
    } catch (error: any) {
      console.error(`Error initiating ${platform} connection:`, error);
      
      // Show error toast
      toast({
        title: "Connection Error",
        description: error.message || `There was an error connecting to ${platform}`,
        variant: "destructive",
      });
      
      // Set detailed error information
      setError(error.message || `There was an error connecting to ${platform}`);
      
      // Set more focused error information for better troubleshooting
      if (error.message) {
        if (error.message.includes("API credentials")) {
          setErrorType("configuration");
          setErrorDetails("The platform API credentials are not correctly configured.");
        } else if (error.message.includes("edge function")) {
          setErrorType("edge_function");
          setErrorDetails("There was an error with the secure connection service.");
        } else {
          setErrorType("initialization");
          setErrorDetails(`Failed to start the secure connection flow for ${platform}.`);
        }
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
    handleConnectionInitiation,
    clearErrors: () => {
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
    }
  };
};

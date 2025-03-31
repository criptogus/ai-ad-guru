
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initiateOAuth } from './oauthService';
import { AdPlatform } from './types';
import { useNavigate } from 'react-router-dom';

export const useConnectionInitiation = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConnectionInitiation = async (platform: AdPlatform, userId?: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to connect an ad account",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // CRITICAL FIX: Always use the /connections path in the redirect URI
      // This ensures consistent handling and prevents 404s after redirect
      // Make sure redirect URI matches with what's configured in Google Cloud Console
      const redirectUri = `${window.location.origin}/connections`;
      
      console.log(`Initiating ${platform} connection with redirect URI:`, redirectUri);
      
      // Get OAuth URL from edge function
      const authUrl = await initiateOAuth({
        platform,
        userId,
        redirectUri
      });
      
      if (authUrl) {
        // Redirect user to the OAuth provider
        window.location.href = authUrl;
      } else {
        throw new Error(`Could not generate auth URL for ${platform}`);
      }
    } catch (error: any) {
      console.error(`Error initiating ${platform} connection:`, error);
      
      // Show error toast
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${platform}`,
        variant: "destructive",
      });
      
      // Set detailed error information
      setError(error.message || `Failed to connect to ${platform}`);
      
      // Add more specific error information
      if (error.message) {
        if (error.message.includes("Missing") && error.message.includes("credentials")) {
          setErrorType("configuration");
          setErrorDetails(`Missing ${platform} API credentials in server configuration. Please contact support.`);
        } else {
          setErrorType(platform);
          setErrorDetails(error.message);
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
    handleConnectionInitiation
  };
};


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
      
      // IMPORTANT: Always use the production domain or the current origin for redirects
      // This ensures consistent handling across environments
      const origin = window.location.origin;
      const redirectUri = `${origin}/connections`;
      
      console.log(`Initiating ${platform} connection with redirect URI:`, redirectUri);
      
      // Additional platform-specific instructions
      if (platform === 'google') {
        toast({
          title: "Connecting Google Ads",
          description: "Make sure to grant permission to manage your Google Ads account, not just basic Google login.",
          duration: 5000,
        });
      } else if (platform === 'linkedin') {
        toast({
          title: "Connecting LinkedIn Ads",
          description: "Make sure to grant permission to manage your LinkedIn Ads account when prompted.",
          duration: 5000,
        });
      }
      
      // Get OAuth URL from edge function
      const authUrl = await initiateOAuth({
        platform,
        userId,
        redirectUri
      });
      
      if (authUrl) {
        // Store current URL to return to this page after OAuth flow completes
        sessionStorage.setItem('oauth_return_path', window.location.pathname);
        
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

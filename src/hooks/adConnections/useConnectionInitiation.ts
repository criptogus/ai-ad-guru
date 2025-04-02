
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initiateOAuth } from './oauthService';
import { AdPlatform } from './types';
import { useNavigate } from 'react-router-dom';

export const useConnectionInitiation = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<AdPlatform | null>(null);
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
      setConnectingPlatform(platform);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // UPDATED: Use the consistent redirect URI
      const redirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
      
      console.log(`Initiating ${platform} connection with redirect URI:`, redirectUri);
      
      // Store current location to return after OAuth flow
      try {
        sessionStorage.setItem('oauth_return_path', '/connections');
      } catch (e) {
        console.warn('Could not save return path to sessionStorage:', e);
      }
      
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
          description: "LinkedIn requires Marketing Developer Platform approval for ads management. Make sure your app has the necessary permissions.",
          duration: 6000,
        });
      }
      
      // Get OAuth URL from edge function
      const authUrl = await initiateOAuth({
        platform,
        userId,
        redirectUri
      });
      
      if (authUrl) {
        // Log before redirecting
        console.log(`Redirecting to OAuth URL: ${authUrl}`);
        
        // Redirect user to the OAuth provider
        window.location.href = authUrl;
      } else {
        throw new Error(`Could not generate auth URL for ${platform}`);
      }
    } catch (error: any) {
      console.error(`Error initiating ${platform} connection:`, error);
      
      // Get the redirectUri for error messages (define it again in this scope)
      const errorRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
      
      // Show error toast
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${platform}`,
        variant: "destructive",
      });
      
      // Set detailed error information
      setError(error.message || `Failed to connect to ${platform}`);
      setErrorType(platform);
      
      // Add more specific error information based on platform
      if (error.message) {
        // Handle LinkedIn-specific errors
        if (platform === 'linkedin') {
          if (error.message.includes("access_denied") && error.message.includes("not allowed to create application tokens")) {
            setErrorDetails("Your LinkedIn app needs Marketing Developer Platform approval. Go to LinkedIn Developers Portal, select your app, and request access to the Marketing Developer Platform.");
          } else if (error.message.includes("redirect_uri_mismatch")) {
            setErrorDetails(`LinkedIn OAuth redirect URI mismatch. Make sure the redirect URI "${errorRedirectUri}" is registered in your LinkedIn app settings.`);
          } else {
            setErrorDetails(`LinkedIn error: ${error.message}. Make sure your app is configured correctly in the LinkedIn Developer Portal.`);
          }
        } 
        // Handle other platform errors
        else if (error.message.includes("Missing") && error.message.includes("credentials")) {
          setErrorType("configuration");
          setErrorDetails(`Missing ${platform} API credentials in server configuration. Please contact support.`);
        } else if (error.message.includes("redirect_uri_mismatch")) {
          setErrorType("oauth_config");
          setErrorDetails(`OAuth redirect URI mismatch. Please ensure the redirect URI "${errorRedirectUri}" is registered in your ${platform} developer console.`);
        } else {
          setErrorDetails(error.message);
        }
      }
    } finally {
      setIsConnecting(false);
      setConnectingPlatform(null);
    }
  };

  return {
    isConnecting,
    connectingPlatform,
    error,
    errorDetails,
    errorType,
    handleConnectionInitiation
  };
};

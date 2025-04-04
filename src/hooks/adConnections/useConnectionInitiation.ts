
import { useState } from 'react';
import { toast } from 'sonner';
import { initiateOAuth } from './oauthService';
import { AdPlatform } from './types';
import { useNavigate } from 'react-router-dom';

export const useConnectionInitiation = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<AdPlatform | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConnectionInitiation = async (platform: AdPlatform, userId?: string) => {
    if (!userId) {
      // Updated to sonner toast API format
      toast.error("Authentication Required", {
        description: "You must be logged in to connect an ad account"
      });
      return;
    }
    
    try {
      setIsConnecting(true);
      setConnectingPlatform(platform);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // IMPORTANT: Use the consistent redirect URI
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
        // Updated to sonner toast API format
        toast.info("Connecting Google Ads", {
          description: "Make sure to grant permission to manage your Google Ads account, not just basic Google login.",
          duration: 5000,
        });
      } else if (platform === 'linkedin') {
        // Updated to sonner toast API format
        toast.info("Connecting LinkedIn Ads", {
          description: "LinkedIn requires Marketing Developer Platform approval for ads management. Make sure your app has the necessary permissions.",
          duration: 6000,
        });
      }
      
      // Generate secure state parameter
      const secureState = crypto.randomUUID();
      console.log(`Generated secure state parameter: ${secureState.substring(0, 8)}...`);
      
      // Store the state in sessionStorage for verification during callback
      try {
        sessionStorage.setItem('adPlatformAuth', JSON.stringify({
          platform,
          state: secureState,
          startTime: Date.now(),
          redirectUri
        }));
        console.log('Stored OAuth state in sessionStorage');
      } catch (e) {
        console.warn('Could not store OAuth state in sessionStorage:', e);
      }
      
      // Log before getting OAuth URL
      console.log(`Requesting OAuth URL for ${platform} with userId ${userId} and redirectUri ${redirectUri}`);
      
      // Get OAuth URL from edge function
      const authUrl = await initiateOAuth({
        platform,
        userId,
        redirectUri,
        state: secureState
      });
      
      console.log(`Received authUrl from initiateOAuth:`, authUrl ? `${authUrl.substring(0, 50)}...` : 'No URL returned');
      
      if (authUrl) {
        // Log before redirecting
        console.log(`Redirecting to OAuth URL: ${authUrl.substring(0, 50)}...`);
        
        // Redirect user to the OAuth provider
        window.location.href = authUrl;
      } else {
        throw new Error(`Could not generate auth URL for ${platform}`);
      }
    } catch (error: any) {
      console.error(`Error initiating ${platform} connection:`, error);
      
      // Show error toast - updated to sonner toast API format
      toast.error("Connection Failed", {
        description: error.message || `Failed to connect to ${platform}`
      });
      
      // Set detailed error information
      setError(error.message || `Failed to connect to ${platform}`);
      setErrorType(platform);
      
      // Add more specific error information based on platform
      if (error.message) {
        if (error.message.includes("function") && error.message.includes("non-2xx")) {
          setErrorType("edge_function");
          setErrorDetails(`Edge function error: The edge function may not be properly deployed or is missing required credentials. Please check the Supabase edge function logs for more details.`);
        } 
        else if (platform === 'google' && error.message.includes("redirect_uri_mismatch")) {
          setErrorType("oauth_config");
          setErrorDetails(`Google OAuth redirect URI mismatch. Please ensure the redirect URI "https://auth.zeroagency.ai/auth/v1/callback" is registered in your Google Cloud Console.`);
        }
        else if (error.message.includes("Missing") && error.message.includes("credentials")) {
          setErrorType("configuration");
          setErrorDetails(`Missing ${platform} API credentials in server configuration. Please contact support.`);
        } else if (error.message.includes("redirect_uri_mismatch")) {
          setErrorType("oauth_config");
          setErrorDetails(`OAuth redirect URI mismatch. Please ensure the redirect URI "https://auth.zeroagency.ai/auth/v1/callback" is registered in your ${platform} developer console.`);
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

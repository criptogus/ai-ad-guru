
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdPlatform } from './types';
import { tokenSecurity } from '@/services/security/tokenSecurity';
import { initiateOAuth } from './oauthService';

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
      
      // Direct call to initiateOAuth from oauthService
      const authUrl = await initiateOAuth({
        platform,
        userId,
        redirectUri
      });
      
      // Redirect to the authorization URL
      console.log(`Redirecting to ${platform} auth URL:`, authUrl);
      window.location.href = authUrl;
      
    } catch (error: any) {
      console.error(`Error in ${platform} connection initiation:`, error);
      
      setError(error.message || `Failed to connect to ${platform}`);
      setErrorType(platform);
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

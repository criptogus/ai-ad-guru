
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
      
      const redirectUri = `${window.location.origin}/config`;
      
      console.log(`Initiating ${platform} connection`);
      
      await tokenSecurity.logSecurityEvent({
        event: 'oauth_initiated',
        user_id: userId,
        platform,
        timestamp: new Date().toISOString()
      });
      
      const authUrl = await initiateOAuth({ platform, userId, redirectUri });
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error(`Failed to get authorization URL for ${platform}`);
      }
    } catch (error: any) {
      console.error(`Error in ${platform} connection:`, error.message);
      
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


import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isOAuthCallback, handleOAuthCallback } from './oauthService';
import { tokenSecurity } from '@/services/security/tokenSecurity';

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
      
      // Security enhancement: Log OAuth callback attempt (minimal logging to save space)
      await tokenSecurity.logSecurityEvent({
        event: 'oauth_callback_started',
        user_id: userId,
        timestamp: new Date().toISOString()
      });
      
      const result = await handleOAuthCallback(redirectUri);
      
      if (result) {
        // Refresh the connections list
        await fetchConnections();
        
        // Security enhancement: Log successful OAuth connection (minimal logging)
        await tokenSecurity.logSecurityEvent({
          event: 'oauth_connection_success',
          user_id: userId,
          platform: result.platform,
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Account Connected Securely",
          description: `Successfully connected to ${
            result.platform === 'google' ? 'Google' : 
            result.platform === 'meta' ? 'Meta' : 
            result.platform === 'linkedin' ? 'LinkedIn' : 'Microsoft'
          } Ads`,
        });
      }
    } catch (error: any) {
      console.error('Error completing OAuth flow:', error);
      
      // Minimal security logging to save space
      if (userId) {
        await tokenSecurity.logSecurityEvent({
          event: 'oauth_connection_error',
          user_id: userId,
          timestamp: new Date().toISOString(),
          error: error.message || "Unknown error"
        }).catch(e => console.warn("Failed to log security event"));
      }
      
      toast({
        title: "Connection Failed",
        description: error.message || "There was an error connecting your account",
        variant: "destructive",
      });
      
      setError(error.message || "There was an error connecting your account");
      
      // Set more focused error information
      if (error.message) {
        if (error.message.includes("token")) {
          setErrorType("credentials");
          setErrorDetails("There was a secure error exchanging the authorization code.");
        } else if (error.message.includes("Invalid") || error.message.includes("expired")) {
          setErrorType("credentials");
          setErrorDetails("The authorization response was invalid or expired.");
        } else {
          setErrorType("edge_function");
          setErrorDetails("There was an error completing the secure OAuth flow.");
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
    processOAuthCallback,
    clearErrors: () => {
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
    }
  };
};

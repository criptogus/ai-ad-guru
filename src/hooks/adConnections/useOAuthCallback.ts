
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isOAuthCallback, handleOAuthCallback } from './oauthService';
import { tokenSecurity } from '@/services/security/tokenSecurity';
import { useNavigate } from 'react-router-dom';

export const useOAuthCallback = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const navigate = useNavigate();

  const processOAuthCallback = async (userId: string | undefined, fetchConnections: () => Promise<void>) => {
    // Check if this is an OAuth callback and user is authenticated
    if (!isOAuthCallback() || !userId) return false;
    
    try {
      // Start processing and clear any previous errors
      setIsConnecting(true);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // Get current origin for proper redirect handling
      const origin = window.location.origin;
      const redirectUri = `${origin}/connections`;
      
      // Log OAuth callback attempt for security
      await tokenSecurity.logSecurityEvent({
        event: 'oauth_callback_started',
        user_id: userId,
        timestamp: new Date().toISOString()
      });
      
      console.log('Processing OAuth callback with redirectUri:', redirectUri);
      
      // Handle the OAuth callback
      const result = await handleOAuthCallback(redirectUri);
      
      if (result) {
        // If successful, refresh the connections list
        await fetchConnections();
        
        // Log successful OAuth connection
        await tokenSecurity.logSecurityEvent({
          event: 'oauth_connection_success',
          user_id: userId,
          platform: result.platform,
          timestamp: new Date().toISOString()
        });
        
        // Get platform display name
        const platformName = 
          result.platform === 'google' ? 'Google Ads' : 
          result.platform === 'meta' ? 'Meta Ads' : 
          result.platform === 'linkedin' ? 'LinkedIn Ads' : 'Microsoft Ads';
        
        // Show appropriate success message based on platform
        if (result.platform === 'google' && result.googleAdsAccess === false) {
          toast({
            title: "Google Account Connected",
            description: `Note: Only basic Google account access was granted. You may need to reconnect with Google Ads permissions.`,
            variant: "default",
          });
        } else if (result.platform === 'linkedin' && result.linkedInAdsAccess === false) {
          toast({
            title: "LinkedIn Account Connected",
            description: `Note: Only basic LinkedIn account access was granted. You may need to reconnect with LinkedIn Ads permissions.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Account Connected Successfully",
            description: `Your ${platformName} account has been connected securely`,
          });
        }
        
        // Navigate back to connections page to ensure we're on a valid route
        navigate('/connections');
        return true;
      }
      
      // No result means it wasn't an OAuth callback after all
      return false;
    } catch (error: any) {
      console.error('Error completing OAuth flow:', error);
      
      // Log error for security purposes
      await tokenSecurity.logSecurityEvent({
        event: 'oauth_connection_error',
        user_id: userId,
        timestamp: new Date().toISOString(),
        details: { errorMessage: error.message || "Unknown error" }
      }).catch(e => console.warn("Failed to log security event"));
      
      // Show error toast
      toast({
        title: "Connection Failed",
        description: error.message || "There was an error connecting your account",
        variant: "destructive",
      });
      
      // Set detailed error information
      setError(error.message || "There was an error connecting your account");
      
      // Set more focused error information for better troubleshooting
      if (error.message) {
        if (error.message.includes("token")) {
          setErrorType("credentials");
          setErrorDetails("There was a secure error exchanging the authorization code.");
        } else if (error.message.includes("Invalid") || error.message.includes("expired")) {
          setErrorType("credentials");
          setErrorDetails("The authorization response was invalid or expired.");
        } else if (error.message.includes("scope") || error.message.includes("permission")) {
          setErrorType("permissions");
          setErrorDetails("Required permissions were not granted. Please try again and approve all requested permissions.");
        } else {
          setErrorType("edge_function");
          setErrorDetails("There was an error completing the secure OAuth flow.");
        }
      }
      
      // Navigate back to connections page to ensure we're on a valid route
      navigate('/connections');
      return false;
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

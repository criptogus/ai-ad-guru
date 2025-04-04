
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AdPlatform } from './types';
import { 
  extractOAuthParams, 
  handleOAuthError, 
  getStoredOAuthData, 
  cleanupOAuthData,
  exchangeToken,
  getPlatformDisplayName,
  determineRedirectPath
} from './utils/oauthCallbackUtils';
import { setNavigate } from './utils/navigationUtils';

export const useOAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  
  // Set navigate function for utility use
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  
  // Handle any OAuth token in the URL fragment
  useEffect(() => {
    const handleHashParams = async () => {
      if (location.hash && location.hash.includes('access_token')) {
        console.log('OAuth hash detected in useOAuthCallback');
        try {
          // Let Supabase handle the hash params
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error processing hash in useOAuthCallback:', error);
          } else {
            console.log('Session in useOAuthCallback:', data.session ? 'Valid' : 'None');
          }
        } catch (err) {
          console.error('Exception in hash processing:', err);
        }
      }
    };
    
    handleHashParams();
  }, [location.hash]);
  
  const processOAuthCallback = async (userId: string, onSuccess?: () => void) => {
    // Extract OAuth parameters
    const oauthParams = extractOAuthParams(location);
    
    if (!oauthParams) {
      console.log("Not an OAuth callback");
      return;
    }
    
    console.log("Processing OAuth callback:", { 
      hasCode: 'code' in oauthParams, 
      hasError: 'error' in oauthParams,
      fullUrl: window.location.href,
      origin: window.location.origin
    });
    
    // Handle error case
    if ('error' in oauthParams) {
      handleOAuthError(oauthParams);
      navigate('/connections', { replace: true });
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // Get the stored OAuth data
      const storedOAuthData = getStoredOAuthData();
      
      console.log("Retrieved stored OAuth data:", { 
        platform: storedOAuthData?.platform,
        hasStoredState: !!storedOAuthData?.state
      });
      
      // Validate state if we have stored data
      if (storedOAuthData?.state && storedOAuthData.state !== oauthParams.state) {
        console.error("State mismatch!", { 
          returnedState: oauthParams.state,
          storedState: storedOAuthData.state
        });
        throw new Error("Invalid OAuth state parameter. Security validation failed.");
      }
      
      // Exchange code for token
      const platform = storedOAuthData?.platform || 'unknown';
      const data = await exchangeToken(
        oauthParams.code, 
        oauthParams.state, 
        'https://auth.zeroagency.ai/auth/v1/callback',
        platform,
        userId
      );
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to exchange token');
      }
      
      // Clean up stored OAuth data
      cleanupOAuthData();
      
      // Show success message
      const platformName = getPlatformDisplayName(platform);
      
      // Updated to sonner toast API format
      toast.success("Connection Successful", {
        description: `Your ${platformName} account has been connected.`
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Determine where to redirect
      const redirectPath = await determineRedirectPath(userId);
      navigate(redirectPath, { replace: true });
      
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      
      // Set error information
      setError(`Failed to connect ad account: ${error.message}`);
      setErrorDetails(error.message);
      setErrorType('oauth');
      
      // Show error toast - updated to sonner toast API format
      toast.error("Connection Failed", {
        description: error.message || "There was an error connecting your ad account"
      });
      
      // Redirect to connections page on error
      navigate('/connections', { replace: true });
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isConnecting,
    error,
    errorDetails,
    errorType,
    processOAuthCallback
  };
};

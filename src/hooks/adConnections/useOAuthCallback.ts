
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdPlatform, OAuthCallbackResult } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useOAuthCallback = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  
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
    // Parse URL search params
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const platformParam = searchParams.get('platform') || '';
    
    // If no code or error, this is not an OAuth redirect
    if (!code && !error) {
      console.log("No OAuth callback parameters detected");
      return;
    }
    
    console.log("Processing OAuth callback:", { 
      hasCode: !!code, 
      error, 
      errorDescription,
      hasState: !!state, 
      platform: platformParam,
      fullUrl: window.location.href,
      origin: window.location.origin
    });
    
    if (error) {
      const errorMsg = errorDescription ? `${error}: ${errorDescription}` : error;
      toast({
        title: "Authentication Error",
        description: `Error: ${errorMsg}. The platform denied access.`,
        variant: "destructive",
      });
      
      // Clear URL params and redirect to connections page
      navigate('/connections', { replace: true });
      return;
    }
    
    if (!code || !state) {
      toast({
        title: "Authentication Error",
        description: "Missing required OAuth parameters",
        variant: "destructive",
      });
      
      // Clear URL params and redirect to connections page
      navigate('/connections', { replace: true });
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      setErrorDetails(null);
      setErrorType(null);
      
      // UPDATED: Use the consistent redirect URI
      const redirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
      console.log("Using redirect URI for token exchange:", redirectUri);
      
      // Exchange code for token via Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ad-account-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'exchangeToken',
          code,
          state,
          redirectUri,
          userId
        }),
      });
      
      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || `Status: ${response.status}`;
        } catch (e) {
          errorText = await response.text();
        }
        console.error("Token exchange error response:", errorText);
        throw new Error(`Token exchange failed: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Token exchange response:", data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to exchange token');
      }
      
      // Success
      const result: OAuthCallbackResult = data.result;
      const platformName = 
        result.platform === 'google' ? 'Google Ads' :
        result.platform === 'meta' ? 'Meta Ads' :
        result.platform === 'linkedin' ? 'LinkedIn Ads' :
        result.platform === 'microsoft' ? 'Microsoft Ads' : 
        'Ad Platform';
      
      toast({
        title: "Connection Successful",
        description: `Your ${platformName} account has been connected.`,
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Check how many connections the user has
      const { count, error: countError } = await supabase
        .from('user_integrations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
      if (countError) {
        console.error('Error checking connection count:', countError);
      }
      
      // Determine where to redirect based on connection count
      if (count === 1) {
        // First connection, stay on connections page
        navigate('/connections', { replace: true });
      } else {
        // User has multiple connections, redirect to campaign creation
        navigate('/campaign/create', { replace: true });
      }
      
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      
      // Set error information
      setError(`Failed to connect ad account: ${error.message}`);
      setErrorDetails(error.message);
      setErrorType('oauth');
      
      // Show error toast
      toast({
        title: "Connection Failed",
        description: error.message || "There was an error connecting your ad account",
        variant: "destructive",
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

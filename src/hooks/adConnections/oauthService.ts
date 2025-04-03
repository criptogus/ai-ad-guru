
import { supabase } from "@/integrations/supabase/client";
import { OAuthParams, AdPlatform, OAuthCallbackResult } from "./types";
import { tokenSecurity } from "@/services/security/tokenSecurity";

const OAUTH_STORAGE_KEY = 'adPlatformAuth';

export const initiateOAuth = async (params: OAuthParams) => {
  const { platform, userId } = params;
  
  if (!userId) {
    throw new Error('User must be authenticated to connect ad accounts');
  }
  
  // Always use the consistent redirect URI
  const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
  
  console.log(`==== OAUTH INITIATION DEBUG INFO ====`);
  console.log(`Initiating ${platform} OAuth flow`);
  console.log(`Using redirect URI: ${effectiveRedirectUri}`);
  console.log(`For user: ${userId}`);
  console.log(`Make sure this URI is registered in your ${platform} developer console: ${effectiveRedirectUri}`);
  console.log(`=====================================`);
  
  try {
    // Generate a secure state
    const state = crypto.randomUUID();
    
    // Generate the OAuth URL from our edge function
    console.log(`Invoking edge function for ${platform} OAuth URL generation with state: ${state}`);
    const response = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'getAuthUrl',
        platform,
        redirectUri: effectiveRedirectUri,
        userId,
        state // Pass the state parameter to the edge function
      }
    });
    
    if (!response) {
      console.error('No response from edge function');
      throw new Error(`Failed to initialize ${platform} OAuth flow. No response from server.`);
    }

    if (response.error) {
      console.error(`Error response from edge function:`, response.error);
      
      // Enhanced error handling with more specific information
      let errorMessage = `Failed to initialize ${platform} OAuth flow: ${response.error.message || 'Unknown error'}`;
      
      // Provide more specific error messages for common issues
      if (response.error.message && response.error.message.includes('Missing required')) {
        errorMessage = `Admin needs to configure ${platform} API credentials in Supabase`;
      } else if (response.error.message && response.error.message.includes('non-2xx status')) {
        errorMessage = `Edge function error: The Supabase edge function returned a non-2xx status code. Check if the edge function is deployed correctly and all required credentials are set.`;
      } else if (response.error.message && response.error.message.includes('Failed to prepare OAuth flow')) {
        errorMessage = `Database error: ${response.error.message}. Please check database permissions or connection.`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = response.data;
    
    // Enhanced validation for authUrl
    if (!data) {
      throw new Error(`Empty response from edge function for ${platform} OAuth URL generation`);
    }
    
    if (!data.success) {
      throw new Error(data.error || `Failed to initialize ${platform} OAuth flow`);
    }
    
    // Check for authUrl or url property in response (handle both formats)
    const authUrl = data.authUrl || data.url;
    
    if (!authUrl) {
      console.error('Response missing authUrl/url:', data);
      throw new Error(`Failed to get valid auth URL for ${platform}`);
    }
    
    // Store OAuth flow information in sessionStorage
    try {
      sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify({
        platform,
        inProgress: true,
        userId,
        startTime: Date.now(),
        redirectUri: effectiveRedirectUri,
        state: data.state || state // Use the state from response if available, fallback to local state
      }));
    } catch (storageError) {
      console.warn('Could not store OAuth state in session storage:', storageError);
      // Continue even if storage fails, as it might be due to private browsing
    }
    
    // Return the OAuth URL for redirection
    return authUrl;
  } catch (error) {
    console.error(`==== OAUTH ERROR ====`);
    console.error(`Error in initiateOAuth:`, error);
    console.error(`===================`);
    throw error;
  }
};

export const handleOAuthCallback = async (redirectUri: string): Promise<OAuthCallbackResult | null> => {
  // Check if we're coming back from an OAuth redirect
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');
  
  console.log("OAuth callback parameters:", { 
    hasCode: Boolean(code), 
    hasState: Boolean(state), 
    error, 
    errorDescription,
    currentUrl: window.location.href
  });
  
  // Clean up the URL parameters regardless of the outcome
  try {
    if (code || error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (historyError) {
    console.warn('Failed to clean URL:', historyError);
  }
  
  // Check for OAuth errors from the provider
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    throw new Error(`Authorization denied or cancelled: ${errorDescription || error}`);
  }
  
  // Retrieve stored OAuth flow data
  let authData;
  try {
    const storedAuthData = sessionStorage.getItem(OAUTH_STORAGE_KEY);
    if (!code || !state || !storedAuthData) {
      return null; // Not a callback or missing data
    }
    
    authData = JSON.parse(storedAuthData);
    console.log("Retrieved stored OAuth data:", { 
      platform: authData.platform,
      hasUserId: Boolean(authData.userId),
      storedRedirectUri: authData.redirectUri
    });
  } catch (storageError) {
    console.error('Failed to retrieve OAuth state from session storage:', storageError);
    throw new Error('OAuth state could not be retrieved. Please try again.');
  }
  
  const { platform, userId, startTime } = authData;
  
  // Check for timeout (more than 10 minutes)
  if (startTime && Date.now() - startTime > 10 * 60 * 1000) {
    // Clear the stored OAuth data
    try {
      sessionStorage.removeItem(OAUTH_STORAGE_KEY);
    } catch (storageError) {
      console.warn('Could not clear OAuth state from session storage:', storageError);
    }
    throw new Error('OAuth flow timed out. Please try again.');
  }
  
  // Clear the stored OAuth data
  try {
    sessionStorage.removeItem(OAUTH_STORAGE_KEY);
  } catch (storageError) {
    console.warn('Could not clear OAuth state from session storage:', storageError);
  }
  
  // Always use the consistent redirect URI
  const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
  
  console.log(`Using callback redirect URI: ${effectiveRedirectUri}`);
  
  try {
    // Exchange the code for tokens
    console.log("Invoking edge function for token exchange with params:", {
      platform,
      hasCode: Boolean(code),
      hasState: Boolean(state),
      redirectUri: effectiveRedirectUri
    });
    
    const response = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'exchangeToken',
        code,
        state,
        platform,
        redirectUri: effectiveRedirectUri
      }
    });
    
    if (!response) {
      console.error('No response from token exchange');
      throw new Error(`Failed to exchange token for ${platform}. No response from server.`);
    }

    if (response.error) {
      console.error(`Error response from exchange token:`, response.error);
      throw new Error(`Failed to exchange token for ${platform}: ${response.error.message || 'Unknown error'}`);
    }
    
    const data = response.data;
    console.log("Token exchange response:", {
      success: data?.success,
      platform: data?.platform,
      hasError: Boolean(data?.error)
    });
    
    if (!data || !data.success) {
      console.error(`Invalid response from token exchange:`, data);
      throw new Error(data?.error || `Failed to complete ${platform} connection`);
    }
    
    // Log successful token exchange for security auditing
    try {
      await tokenSecurity.logSecurityEvent({
        event: 'oauth_token_exchange_success',
        user_id: userId,
        platform,
        timestamp: new Date().toISOString(),
        details: {
          origin: window.location.origin
        }
      });
    } catch (logError) {
      // Non-blocking error, just log to console
      console.warn('Failed to log security event:', logError);
    }
    
    // Return platform-specific access flags with proper typing
    const baseResult = { 
      platform, 
      userId, 
      success: true,
    };

    // Add platform-specific access flags with proper typing
    if (platform === 'google') {
      return {
        ...baseResult,
        platform: 'google' as const,
        googleAdsAccess: data.googleAdsAccess !== undefined ? data.googleAdsAccess : undefined
      };
    } else if (platform === 'linkedin') {
      return {
        ...baseResult,
        platform: 'linkedin' as const,
        linkedInAdsAccess: data.linkedInAdsAccess !== undefined ? data.linkedInAdsAccess : undefined
      };
    } else if (platform === 'meta') {
      return {
        ...baseResult,
        platform: 'meta' as const,
        metaAdsAccess: data.metaAdsAccess !== undefined ? data.metaAdsAccess : undefined
      };
    } else if (platform === 'microsoft') {
      return {
        ...baseResult,
        platform: 'microsoft' as const,
        microsoftAdsAccess: data.microsoftAdsAccess !== undefined ? data.microsoftAdsAccess : undefined
      };
    }
    
    return baseResult as OAuthCallbackResult;
  } catch (error) {
    // Log failed token exchange for security auditing
    try {
      await tokenSecurity.logSecurityEvent({
        event: 'oauth_token_exchange_failure',
        user_id: userId,
        platform,
        timestamp: new Date().toISOString(),
        details: {
          error: error.message || 'Unknown error',
          origin: window.location.origin
        }
      });
    } catch (logError) {
      // Non-blocking error, just log to console
      console.warn('Failed to log security event:', logError);
    }
    
    console.error(`Error in handleOAuthCallback:`, error);
    throw error;
  }
};

export const isOAuthCallback = (): boolean => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  // More robust check - we need both code and state
  if (!code || !state) {
    return false;
  }
  
  // Check session storage for OAuth state
  let hasStoredOAuthState = false;
  try {
    const storedAuthData = sessionStorage.getItem(OAUTH_STORAGE_KEY);
    hasStoredOAuthState = Boolean(storedAuthData);
  } catch (error) {
    console.warn('Could not access session storage:', error);
  }
  
  return Boolean(code && state && hasStoredOAuthState);
};

export const clearOAuthState = () => {
  try {
    sessionStorage.removeItem(OAUTH_STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Could not clear OAuth state:', error);
    return false;
  }
};

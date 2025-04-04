
/**
 * OAuth callback handler utilities
 */

import { supabase } from "@/integrations/supabase/client";
import { OAuthCallbackResult } from "../types";
import { clearOAuthData, getOAuthData } from "./storage";
import { DEFAULT_REDIRECT_URI, OAUTH_TIMEOUT_MS } from "./constants";
import { tokenSecurity } from "@/services/security/tokenSecurity";

/**
 * Handle OAuth callback and exchange code for token
 */
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
  if (!code || !state) {
    return null; // Not a callback or missing data
  }
  
  const authData = getOAuthData();
  if (!authData) {
    throw new Error('OAuth state could not be retrieved. Please try again.');
  }
  
  console.log("Retrieved stored OAuth data:", { 
    platform: authData.platform,
    hasUserId: Boolean(authData.userId),
    storedRedirectUri: authData.redirectUri
  });
  
  const { platform, userId, startTime } = authData;
  
  // Check for timeout (more than 10 minutes)
  if (startTime && Date.now() - startTime > OAUTH_TIMEOUT_MS) {
    // Clear the stored OAuth data
    clearOAuthData();
    throw new Error('OAuth flow timed out. Please try again.');
  }
  
  // Clear the stored OAuth data
  clearOAuthData();
  
  // Always use the consistent redirect URI
  const effectiveRedirectUri = DEFAULT_REDIRECT_URI;
  
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

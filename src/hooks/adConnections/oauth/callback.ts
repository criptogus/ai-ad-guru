
import { supabase } from "@/integrations/supabase/client";
import { tokenSecurity } from "@/services/security/tokenSecurity";
import { oauthStorage } from "./storage";
import { oauthHelpers } from "./helpers";
import { OAuthCallbackResult } from "./types";

/**
 * Handle OAuth callback from ad platforms
 */
export const handleOAuthCallback = async (redirectUri: string): Promise<OAuthCallbackResult | null> => {
  // Check if we're coming back from an OAuth redirect
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');
  
  // Clean up the URL parameters regardless of the outcome
  oauthHelpers.cleanUrlParameters();
  
  // Check for OAuth errors from the provider
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    throw new Error(`Authorization denied or cancelled: ${errorDescription || error}`);
  }
  
  // Retrieve stored OAuth flow data
  const authData = oauthStorage.getOAuthState();
  if (!code || !state || !authData) {
    return null; // Not a callback or missing data
  }
  
  const { platform, userId, startTime } = authData;
  
  // Check for timeout (more than 10 minutes)
  if (oauthHelpers.hasOAuthFlowTimedOut(startTime)) {
    oauthStorage.clearOAuthState();
    throw new Error('OAuth flow timed out. Please try again.');
  }
  
  // Clear the stored OAuth data
  oauthStorage.clearOAuthState();
  
  // Use the stored redirectUri or fall back to the provided one
  const effectiveRedirectUri = authData.redirectUri || redirectUri;
  console.log(`Using callback redirect URI: ${effectiveRedirectUri}`);
  
  try {
    // Exchange the code for tokens
    const response = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'exchangeToken',
        code,
        state,
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
    
    return { platform, userId, success: true };
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

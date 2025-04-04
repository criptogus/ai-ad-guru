
/**
 * Google Ads OAuth Service
 * Handles OAuth connection to Google Ads platform
 */

import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { GoogleOAuthCredentials } from './types/googleConnector';

/**
 * Initiate Google OAuth connection flow with proper Google Ads API scopes
 */
export const initiateGoogleConnection = async (redirectUri: string): Promise<string> => {
  try {
    // Always use the consistent redirect URI
    const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
    
    console.log('Initiating Google Ads connection with redirect URI:', effectiveRedirectUri);
    
    const { data, error } = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'getAuthUrl',
        platform: 'google',
        redirectUri: effectiveRedirectUri
      }
    });
    
    if (error) {
      console.error('Google OAuth initialization failed:', error);
      errorLogger.logError(error, 'initiateGoogleConnection');
      throw new Error(`Failed to initialize Google Ads OAuth flow: ${error.message}`);
    }
    
    if (!data || !data.success || !data.authUrl) {
      const errorMsg = data?.error || 'Failed to generate Google Ads authorization URL';
      console.error('Google auth URL generation failed:', errorMsg, data);
      throw new Error(errorMsg);
    }
    
    console.log('Successfully generated Google OAuth URL:', data.authUrl.substring(0, 50) + '...');
    return data.authUrl;
  } catch (error) {
    errorLogger.logError(error, 'initiateGoogleConnection');
    throw error;
  }
};

/**
 * Handle Google OAuth callback and complete connection
 */
export const handleGoogleCallback = async (
  code: string, 
  redirectUri: string
): Promise<GoogleOAuthCredentials | null> => {
  try {
    // Always use the consistent redirect URI
    const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
    
    console.log('Handling Google callback with code and redirect URI:', effectiveRedirectUri);
    
    const { data, error } = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'exchangeToken',
        code,
        platform: 'google',
        redirectUri: effectiveRedirectUri
      }
    });
    
    if (error) {
      const errorMessage = error.message || 'Failed to exchange Google authorization code';
      console.error('Google token exchange error:', errorMessage);
      errorLogger.logError(new Error(errorMessage), 'handleGoogleCallback');
      
      toast.error("Google Ads Connection Failed", {
        description: `Error exchanging authorization code: ${errorMessage}`
      });
      
      return null;
    }
    
    if (!data || !data.success) {
      const errorMessage = data?.error || 'Failed to exchange Google authorization code';
      console.error('Google token exchange response failed:', errorMessage, data);
      errorLogger.logError(new Error(errorMessage), 'handleGoogleCallback');
      
      toast.error("Google Ads Connection Failed", {
        description: errorMessage
      });
      
      return null;
    }
    
    // Extract token information from response
    const { access_token, refresh_token, expires_in } = data;
    if (!access_token) {
      const errorMessage = 'No access token returned from Google';
      console.error(errorMessage);
      errorLogger.logError(new Error(errorMessage), 'handleGoogleCallback');
      
      toast.error("Google Ads Connection Failed", {
        description: "No access token received from Google"
      });
      
      return null;
    }
    
    const expiresAt = new Date().getTime() + (expires_in * 1000);
    console.log('Google OAuth token exchange successful, token expires at:', new Date(expiresAt).toISOString());
    
    return {
      accessToken: access_token,
      refreshToken: refresh_token || '',
      expiresAt
    };
  } catch (error) {
    console.error('Exception in handleGoogleCallback:', error);
    errorLogger.logError(error, 'handleGoogleCallback');
    
    toast.error("Google Ads Connection Failed", {
      description: error.message || "Unknown error occurred"
    });
    
    return null;
  }
};

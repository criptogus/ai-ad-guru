
/**
 * Google Ads Connector Service
 * Manages OAuth connection to Google Ads platform
 */

import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';

export interface GoogleOAuthCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface GoogleConnectionStatus {
  connected: boolean;
  accountId?: string;
  accountName?: string;
  expiresAt?: number;
  adsAccessGranted?: boolean;
  error?: string;
}

/**
 * Initiate Google OAuth connection flow with proper Google Ads API scopes
 */
export const initiateGoogleConnection = async (redirectUri: string): Promise<string> => {
  try {
    console.log('Initiating Google Ads connection with redirect URI:', redirectUri);
    
    const { data, error } = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'getAuthUrl',
        platform: 'google',
        redirectUri
      }
    });
    
    if (error) {
      errorLogger.logError(error, 'initiateGoogleConnection');
      throw new Error(`Failed to initialize Google Ads OAuth flow: ${error.message}`);
    }
    
    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to generate Google Ads authorization URL');
    }
    
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
    console.log('Handling Google callback with code and redirect URI:', redirectUri);
    
    const { data, error } = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'exchangeToken',
        code,
        platform: 'google',
        redirectUri
      }
    });
    
    if (error || !data || !data.success) {
      const errorMessage = error?.message || data?.error || 'Failed to exchange Google authorization code';
      errorLogger.logError(new Error(errorMessage), 'handleGoogleCallback');
      return null;
    }
    
    // Extract token information from response
    const { access_token, refresh_token, expires_in } = data;
    if (!access_token) {
      errorLogger.logError(new Error('No access token returned'), 'handleGoogleCallback');
      return null;
    }
    
    const expiresAt = new Date().getTime() + (expires_in * 1000);
    
    return {
      accessToken: access_token,
      refreshToken: refresh_token || '',
      expiresAt
    };
  } catch (error) {
    errorLogger.logError(error, 'handleGoogleCallback');
    return null;
  }
};

/**
 * Get Google connection status
 */
export const getGoogleConnectionStatus = async (userId: string): Promise<GoogleConnectionStatus> => {
  try {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'google')
      .single();
    
    if (error || !data) {
      return { 
        connected: false,
        error: error ? error.message : 'No Google Ads connection found'
      };
    }
    
    // Check for Google Ads access specifically
    const adsAccessGranted = data.metadata?.googleAdsVerified === true;
    
    return {
      connected: true,
      accountId: data.account_id || data.metadata?.accountId,
      accountName: data.metadata?.accountName,
      expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : undefined,
      adsAccessGranted
    };
  } catch (error) {
    errorLogger.logError(error, 'getGoogleConnectionStatus');
    return { connected: false, error: error.message };
  }
};

/**
 * Disconnect Google account
 */
export const disconnectGoogle = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('platform', 'google');
    
    if (error) {
      errorLogger.logError(error, 'disconnectGoogle');
      return false;
    }
    
    return true;
  } catch (error) {
    errorLogger.logError(error, 'disconnectGoogle');
    return false;
  }
};

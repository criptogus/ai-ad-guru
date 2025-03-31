
/**
 * LinkedIn Ads Connector Service
 * Handles authentication and connection to LinkedIn Marketing API
 */

import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';

export interface LinkedInOAuthCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface LinkedInConnectionStatus {
  connected: boolean;
  accountId?: string;
  accountName?: string;
  expiresAt?: number;
  adsAccessGranted?: boolean;
  error?: string;
}

/**
 * Initiate LinkedIn OAuth connection flow with proper LinkedIn Ads API scopes
 */
export const initiateLinkedInConnection = async (redirectUri: string): Promise<string> => {
  try {
    console.log('Initiating LinkedIn Ads connection with redirect URI:', redirectUri);
    
    const { data, error } = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'getAuthUrl',
        platform: 'linkedin',
        redirectUri
      }
    });
    
    if (error) {
      errorLogger.logError(error, 'initiateLinkedInConnection');
      throw new Error(`Failed to initialize LinkedIn Ads OAuth flow: ${error.message}`);
    }
    
    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to generate LinkedIn Ads authorization URL');
    }
    
    return data.authUrl;
  } catch (error) {
    errorLogger.logError(error, 'initiateLinkedInConnection');
    throw error;
  }
};

/**
 * Handle LinkedIn OAuth callback and complete connection
 */
export const handleLinkedInCallback = async (
  code: string, 
  redirectUri: string
): Promise<LinkedInOAuthCredentials | null> => {
  try {
    console.log('Handling LinkedIn callback with code and redirect URI:', redirectUri);
    
    const { data, error } = await supabase.functions.invoke('ad-account-auth', {
      body: {
        action: 'exchangeToken',
        code,
        platform: 'linkedin',
        redirectUri
      }
    });
    
    if (error || !data || !data.success) {
      const errorMessage = error?.message || data?.error || 'Failed to exchange LinkedIn authorization code';
      errorLogger.logError(new Error(errorMessage), 'handleLinkedInCallback');
      return null;
    }
    
    // Extract token information from response
    const { access_token, refresh_token, expires_in } = data;
    if (!access_token) {
      errorLogger.logError(new Error('No access token returned'), 'handleLinkedInCallback');
      return null;
    }
    
    const expiresAt = new Date().getTime() + (expires_in * 1000);
    
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt
    };
  } catch (error) {
    errorLogger.logError(error, 'handleLinkedInCallback');
    return null;
  }
};

/**
 * Get LinkedIn connection status
 */
export const getLinkedInConnectionStatus = async (userId: string): Promise<LinkedInConnectionStatus> => {
  try {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'linkedin')
      .single();
    
    if (error || !data) {
      return { 
        connected: false,
        error: error ? error.message : 'No LinkedIn Ads connection found'
      };
    }
    
    // Check for LinkedIn Ads access specifically
    const adsAccessGranted = data.metadata?.linkedInAdsVerified === true;
    
    return {
      connected: true,
      accountId: data.account_id || data.metadata?.accountId,
      accountName: data.metadata?.accountName,
      expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : undefined,
      adsAccessGranted
    };
  } catch (error) {
    errorLogger.logError(error, 'getLinkedInConnectionStatus');
    return { connected: false, error: error.message };
  }
};

/**
 * Disconnect LinkedIn account
 */
export const disconnectLinkedIn = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('platform', 'linkedin');
    
    if (error) {
      errorLogger.logError(error, 'disconnectLinkedIn');
      return false;
    }
    
    return true;
  } catch (error) {
    errorLogger.logError(error, 'disconnectLinkedIn');
    return false;
  }
};

/**
 * Get LinkedIn ad accounts for the user
 */
export const getLinkedInAdAccounts = async (
  accessToken: string
): Promise<Array<{id: string, name: string}>> => {
  try {
    console.log('Getting LinkedIn ad accounts with access token');
    
    // First get organization accounts the user has access to
    const orgResponse = await fetch('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      }
    });
    
    if (!orgResponse.ok) {
      throw new Error(`LinkedIn API error: ${orgResponse.status}`);
    }
    
    const orgData = await orgResponse.json();
    
    if (!orgData.elements || orgData.elements.length === 0) {
      return [];
    }
    
    // Now get ad accounts for the organizations
    const adAccountsResponse = await fetch('https://api.linkedin.com/v2/adAccountsV2?q=search', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      }
    });
    
    if (!adAccountsResponse.ok) {
      throw new Error(`LinkedIn Ad API error: ${adAccountsResponse.status}`);
    }
    
    const adAccountsData = await adAccountsResponse.json();
    
    return (adAccountsData.elements || []).map((account: any) => ({
      id: account.id,
      name: account.name || 'LinkedIn Ad Account'
    }));
  } catch (error) {
    errorLogger.logError(error, 'getLinkedInAdAccounts');
    return [];
  }
};

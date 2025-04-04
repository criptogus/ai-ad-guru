
/**
 * Google Ads Connection Service
 * Manages connection status and account operations
 */

import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';
import { GoogleConnectionStatus, GoogleCredentialsTestResult } from './types/googleConnector';

/**
 * Test Google Ads API connectivity and credentials
 */
export const testGoogleCredentials = async (): Promise<GoogleCredentialsTestResult> => {
  try {
    console.log('Testing Google Ads credentials...');
    
    const { data, error } = await supabase.functions.invoke('ad-account-test', {
      body: { platform: 'google' }
    });
    
    // Log detailed information about the response
    console.log('Google credentials test response:', data);
    
    if (error) {
      console.error('Error testing Google Ads credentials:', error);
      return { 
        success: false, 
        message: `Failed to test Google Ads credentials: ${error.message}` 
      };
    }
    
    // Check if result exists and has the expected properties
    if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
      return { 
        success: Boolean(data.success), 
        message: String(data.message || 'Google Ads credentials test completed')
      };
    }
    
    // Default response if result format is unexpected
    return { 
      success: false, 
      message: 'Invalid response format from Google Ads credentials test'
    };
  } catch (error) {
    errorLogger.logError(error, 'testGoogleCredentials');
    return { 
      success: false, 
      message: `Failed to test Google Ads credentials: ${error.message}` 
    };
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

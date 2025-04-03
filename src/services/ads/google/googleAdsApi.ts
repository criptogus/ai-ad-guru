
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

/**
 * Google Ads API Service
 * This service encapsulates all Google Ads related operations
 */
export const googleAdsApi = {
  /**
   * Check if a user has connected their Google Ads account
   */
  isConnected: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', 'google')
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
        console.error('Error checking Google Ads connection:', error);
      }
      
      return !!data;
    } catch (error) {
      console.error('Exception checking Google Ads connection:', error);
      return false;
    }
  },
  
  /**
   * Create ad campaigns in Google Ads
   */
  createAdCampaign: async (userId: string, campaign: any, ads: any[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-google-campaign', {
        body: { userId, campaign, ads }
      });
      
      if (error) {
        console.error('Error creating Google Ads campaign:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Exception creating Google Ads campaign:', error);
      errorLogger.logError(error, 'createGoogleAdCampaign');
      throw error;
    }
  },
  
  /**
   * Get Google Ads account information
   */
  getAccountInfo: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-google-account', {
        body: { userId }
      });
      
      if (error) {
        console.error('Error getting Google Ads account info:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Exception getting Google Ads account info:', error);
      errorLogger.logError(error, 'getGoogleAdsAccountInfo');
      throw error;
    }
  },
  
  /**
   * Get Google Ads campaigns
   */
  getCampaigns: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-google-campaigns', {
        body: { userId }
      });
      
      if (error) {
        console.error('Error getting Google Ads campaigns:', error);
        throw error;
      }
      return data?.campaigns || [];
    } catch (error) {
      console.error('Exception getting Google Ads campaigns:', error);
      errorLogger.logError(error, 'getGoogleAdsCampaigns');
      throw error;
    }
  },

  /**
   * List accessible customer accounts
   */
  listAccessibleAccounts: async (userId: string) => {
    try {
      console.log('Listing accessible Google Ads accounts for user:', userId);
      
      const { data, error } = await supabase.functions.invoke('google-ads-accounts', {
        body: { userId }
      });
      
      if (error) {
        console.error('Error from google-ads-accounts function:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('No data returned from google-ads-accounts function');
        return [];
      }
      
      console.log('Google Ads accounts function returned:', data);
      return data?.accounts || [];
    } catch (error) {
      console.error('Exception listing Google Ads accounts:', error);
      errorLogger.logError(error, 'listGoogleAdsAccounts');
      throw error;
    }
  },
  
  /**
   * Test Google Ads API credentials and connectivity
   */
  testCredentials: async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ad-account-test', {
        body: { platform: 'google' }
      });
      
      if (error) {
        console.error('Error testing Google Ads credentials:', error);
        return {
          success: false,
          message: `API Error: ${error.message}`
        };
      }
      
      return {
        success: data?.success === true,
        message: data?.message || 'Credentials test completed'
      };
    } catch (error) {
      console.error('Exception testing Google Ads credentials:', error);
      errorLogger.logError(error, 'testGoogleAdsCredentials');
      return {
        success: false,
        message: `Exception: ${error.message}`
      };
    }
  }
};


import { supabase } from '@/integrations/supabase/client';

/**
 * Google Ads API Service
 * This service encapsulates all Google Ads related operations
 */
export const googleAdsApi = {
  /**
   * Check if a user has connected their Google Ads account
   */
  isConnected: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'google_ads')
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error checking Google Ads connection:', error);
    }
    
    return !!data;
  },
  
  /**
   * Create ad campaigns in Google Ads
   */
  createAdCampaign: async (userId: string, campaign: any, ads: any[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-google-campaign', {
        body: { userId, campaign, ads }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating Google Ads campaign:', error);
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
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting Google Ads account info:', error);
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
      
      if (error) throw error;
      return data?.campaigns || [];
    } catch (error) {
      console.error('Error getting Google Ads campaigns:', error);
      throw error;
    }
  },

  /**
   * List accessible customer accounts
   */
  listAccessibleAccounts: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('google-ads-accounts', {
        body: { userId }
      });
      
      if (error) throw error;
      return data?.accounts || [];
    } catch (error) {
      console.error('Error listing Google Ads accounts:', error);
      throw error;
    }
  }
};


import { supabase } from '@/integrations/supabase/client';

/**
 * Meta Ads API Service
 * This service encapsulates all Meta Ads related operations
 */
export const metaAdsApi = {
  /**
   * Check if a user has connected their Meta Ads account
   */
  isConnected: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'meta_ads')
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error checking Meta Ads connection:', error);
    }
    
    return !!data;
  },
  
  /**
   * Create ad campaigns in Meta Ads
   */
  createAdCampaign: async (userId: string, campaign: any, ads: any[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-meta-campaign', {
        body: { userId, campaign, ads }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating Meta Ads campaign:', error);
      throw error;
    }
  },
  
  /**
   * Get Meta Ads account information
   */
  getAccountInfo: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-meta-account', {
        body: { userId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting Meta Ads account info:', error);
      throw error;
    }
  },
  
  /**
   * Get Meta Ads campaigns
   */
  getCampaigns: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-meta-campaigns', {
        body: { userId }
      });
      
      if (error) throw error;
      return data?.campaigns || [];
    } catch (error) {
      console.error('Error getting Meta Ads campaigns:', error);
      throw error;
    }
  }
};

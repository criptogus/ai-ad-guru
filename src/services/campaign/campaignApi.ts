
import { supabase } from '@/integrations/supabase/client';

/**
 * Campaign Service API
 * This service encapsulates all campaign-related operations
 */
export const campaignApi = {
  /**
   * Get all campaigns for a user
   */
  getUserCampaigns: async (userId: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Get a specific campaign
   */
  getCampaign: async (campaignId: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Create a new campaign
   */
  createCampaign: async (campaignData: any) => {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Update an existing campaign
   */
  updateCampaign: async (campaignId: string, updateData: any) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', campaignId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Delete a campaign
   */
  deleteCampaign: async (campaignId: string) => {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);
      
    if (error) throw error;
    return true;
  },
  
  /**
   * Get campaign performance data
   */
  getCampaignPerformance: async (campaignId: string) => {
    const { data, error } = await supabase
      .from('campaign_performance')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
};


import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Creates a new campaign
 */
export const createCampaign = async (campaignData: any) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating campaign:', error);
    toast.error('Failed to create campaign');
    return null;
  }
};

/**
 * Gets all campaigns for a user
 */
export const getUserCampaigns = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
};

/**
 * Gets a campaign by ID
 */
export const getCampaignById = async (campaignId: string) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
};

/**
 * Updates a campaign
 */
export const updateCampaign = async (campaignId: string, updateData: any) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', campaignId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating campaign:', error);
    toast.error('Failed to update campaign');
    return null;
  }
};

/**
 * Deletes a campaign
 */
export const deleteCampaign = async (campaignId: string) => {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting campaign:', error);
    toast.error('Failed to delete campaign');
    return false;
  }
};

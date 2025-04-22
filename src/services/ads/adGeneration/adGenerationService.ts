
import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData } from './types/promptTypes';

export const generateAds = async (data: CampaignPromptData) => {
  try {
    console.log('Calling generate-ads function with data:', data);
    
    const { data: response, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        campaignData: data,
        platforms: data.platforms
      }
    });

    if (error) {
      console.error('Error calling generate-ads function:', error);
      throw new Error(error.message || 'Failed to call generate ads function');
    }

    if (!response?.success) {
      console.error('Generate ads function returned an error:', response?.error);
      throw new Error(response?.error || 'Generate ads returned an unsuccessful response');
    }

    return response.data;
  } catch (error) {
    console.error('Error in generateAds service:', error);
    throw error;
  }
};

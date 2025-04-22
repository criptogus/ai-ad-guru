
import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData } from './types/promptTypes';
import { GeneratedAdContent } from './types';

export const generateAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
  try {
    console.log('Calling generate-ads function with data:', JSON.stringify(data, null, 2));
    
    // Show detailed information about what's being sent to the function
    console.log('Platform(s):', data.platforms);
    console.log('Company name:', data.companyName);
    console.log('Mind trigger:', data.mindTrigger || 'None');
    
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

    console.log('Ad generation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in generateAds service:', error);
    throw error;
  }
};

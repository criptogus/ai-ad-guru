
import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData } from './types/promptTypes';
import { GeneratedAdContent } from './types';

export const generateAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
  try {
    console.log('Calling generate-ads function with data:', JSON.stringify(data, null, 2));
    
    // Show detailed information about what's being sent to the function
    console.log('Platform(s):', data.platforms);
    console.log('Company name:', data.companyName);
    console.log('Mind triggers:', data.mindTriggers || 'None specific to platforms');
    console.log('Objective:', data.objective);
    console.log('Brand tone:', data.brandTone);
    console.log('Language:', data.language);
    
    // Organize the data for the Edge Function call
    const { data: response, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        campaignData: {
          ...data,
          // Make sure we're providing a properly structured mind triggers object
          mindTriggers: data.mindTriggers || {},
          // But also keep backward compatibility with older code
          mindTrigger: data.mindTrigger || 
            (data.platforms && data.platforms[0] && data.mindTriggers ? 
              data.mindTriggers[data.platforms[0]] : undefined)
        },
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

// Specific platform ad generation services - renamed to avoid conflicts
export const generateLinkedInAdsContent = async (campaignData: any, mindTrigger?: string): Promise<any[] | null> => {
  try {
    console.log('Generating specific LinkedIn ads with:', { campaignData, mindTrigger });
    const promptData: CampaignPromptData = {
      ...campaignData,
      platforms: ['linkedin'],
      mindTrigger,
      mindTriggers: mindTrigger ? { linkedin: mindTrigger } : undefined
    };
    
    const result = await generateAds(promptData);
    return result?.linkedin_ads || null;
  } catch (error) {
    console.error('Error generating LinkedIn ads:', error);
    return null;
  }
};

export const generateMicrosoftAdsContent = async (campaignData: any, mindTrigger?: string): Promise<any[] | null> => {
  try {
    console.log('Generating specific Microsoft ads with:', { campaignData, mindTrigger });
    const promptData: CampaignPromptData = {
      ...campaignData,
      platforms: ['microsoft'],
      mindTrigger,
      mindTriggers: mindTrigger ? { microsoft: mindTrigger } : undefined
    };
    
    const result = await generateAds(promptData);
    return result?.microsoft_ads || null;
  } catch (error) {
    console.error('Error generating Microsoft ads:', error);
    return null;
  }
};

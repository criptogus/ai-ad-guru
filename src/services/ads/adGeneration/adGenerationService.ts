
import { supabase } from '@/integrations/supabase/client';
import { 
  CampaignPromptData,
  GeneratedAdContent, 
  GoogleAd, 
  MetaAd,
  LinkedInAd,
  MicrosoftAd 
} from './types';
import { toast } from 'sonner';

/**
 * Generates ads based on campaign data
 */
export async function generateAds(
  campaignData: CampaignPromptData
): Promise<GeneratedAdContent> {
  // Initialize result object
  const result: GeneratedAdContent = {
    google: [],
    meta: [],
    linkedin: [],
    microsoft: []
  };

  console.log('Generating ads with campaign data:', campaignData);
  
  // Track platforms to process
  const platformsToGenerate = campaignData.platforms || [];
  console.log('Platforms to generate:', platformsToGenerate);
  
  try {
    // Generate ads for each selected platform in parallel
    const generationPromises = platformsToGenerate.map(async platform => {
      try {
        console.log(`Generating ads for platform: ${platform}`);
        
        // Call the Edge Function for ad generation
        const { data, error } = await supabase.functions.invoke('generate-ads', {
          body: {
            platform,
            campaignData,
            mindTrigger: campaignData.mindTriggers?.[platform] || campaignData.mindTrigger
          }
        });
        
        // Log response for debugging
        console.log(`Response from ${platform} ad generation:`, data);
        
        if (error) {
          console.error(`Error generating ${platform} ads:`, error);
          toast.error(`Erro na geração de anúncios para ${platform}: ${error.message || 'Erro desconhecido'}`);
          return;
        }
        
        if (!data || !data.success) {
          console.error(`Failed to generate ${platform} ads:`, data?.error || 'Unknown error');
          
          // Handle credit-specific error
          if (data?.errorCode === 'INSUFFICIENT_CREDITS') {
            toast.error('Créditos insuficientes', {
              description: 'Você precisa adquirir mais créditos para gerar anúncios.'
            });
          } else {
            toast.error(`Falha na geração de anúncios para ${platform}`);
          }
          
          return;
        }
        
        // Process successful responses
        if (data.data && Array.isArray(data.data)) {
          console.log(`Successfully generated ${data.data.length} ads for ${platform}`);
          
          // Map the generated ads to the appropriate platform in the result object
          result[platform as keyof GeneratedAdContent] = data.data;
          
          toast.success(`${data.data.length} anúncios gerados para ${getPlatformDisplayName(platform)}`, {
            description: 'Você pode visualizar e personalizar os anúncios agora.'
          });
        }
      } catch (platformError) {
        console.error(`Error in ${platform} ad generation:`, platformError);
        toast.error(`Erro na geração de anúncios para ${platform}`);
      }
    });
    
    // Wait for all platform generations to complete
    await Promise.all(generationPromises);
    
    console.log('Final ad generation result:', result);
    
    return result;
  } catch (error) {
    console.error('Error in ad generation:', error);
    toast.error('Erro na geração de anúncios', {
      description: error instanceof Error ? error.message : 'Erro desconhecido'
    });
    
    // Return whatever we've managed to generate
    return result;
  }
}

/**
 * Generate LinkedIn Ads content
 */
export async function generateLinkedInAdsContent(
  campaignData: CampaignPromptData,
  mindTrigger?: string
): Promise<LinkedInAd[]> {
  console.log('Generating LinkedIn ads content with data:', campaignData);
  
  try {
    // Prepare the data with platform specific options
    const requestData = {
      platform: 'linkedin',
      campaignData: {
        ...campaignData,
        mindTrigger: mindTrigger || campaignData.mindTrigger,
        platforms: ['linkedin']
      }
    };
    
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: requestData
    });
    
    if (error) {
      console.error('Error generating LinkedIn ads:', error);
      toast.error('Error generating LinkedIn ads', {
        description: error.message || 'Unknown error'
      });
      return [];
    }
    
    if (!data?.success || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid LinkedIn ads data returned:', data);
      toast.error('Failed to generate LinkedIn ads');
      return [];
    }
    
    console.log(`Generated ${data.data.length} LinkedIn ads:`, data.data);
    return data.data as LinkedInAd[];
  } catch (error) {
    console.error('Error in generateLinkedInAdsContent:', error);
    toast.error('Error generating LinkedIn ads');
    return [];
  }
}

/**
 * Generate Microsoft Ads content
 */
export async function generateMicrosoftAdsContent(
  campaignData: CampaignPromptData,
  mindTrigger?: string
): Promise<MicrosoftAd[]> {
  console.log('Generating Microsoft ads content with data:', campaignData);
  
  try {
    // Prepare the data with platform specific options
    const requestData = {
      platform: 'microsoft',
      campaignData: {
        ...campaignData,
        mindTrigger: mindTrigger || campaignData.mindTrigger,
        platforms: ['microsoft']
      }
    };
    
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: requestData
    });
    
    if (error) {
      console.error('Error generating Microsoft ads:', error);
      toast.error('Error generating Microsoft ads', {
        description: error.message || 'Unknown error'
      });
      return [];
    }
    
    if (!data?.success || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid Microsoft ads data returned:', data);
      toast.error('Failed to generate Microsoft ads');
      return [];
    }
    
    console.log(`Generated ${data.data.length} Microsoft ads:`, data.data);
    return data.data as MicrosoftAd[];
  } catch (error) {
    console.error('Error in generateMicrosoftAdsContent:', error);
    toast.error('Error generating Microsoft ads');
    return [];
  }
}

// Helper function to get display name for platforms
function getPlatformDisplayName(platform: string): string {
  const displayNames: Record<string, string> = {
    'google': 'Google Ads',
    'meta': 'Meta/Instagram',
    'linkedin': 'LinkedIn',
    'microsoft': 'Microsoft/Bing'
  };
  
  return displayNames[platform] || platform;
}


import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData } from './types/promptTypes';
import { GeneratedAdContent, 
         GoogleAd, 
         MetaAd,
         LinkedInAd,
         MicrosoftAd } from './types';
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

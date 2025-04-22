
import { useState } from 'react';
import { MetaAd } from '@/hooks/adGeneration';
import { generateAdImage } from '@/services/ads/adGeneration/imageGenerationService';
import { useToast } from '@/components/ui/use-toast';

interface UseImageGenerationHandlerProps {
  metaAds?: MetaAd[];
  linkedInAds?: MetaAd[];
  setMetaAds?: (ads: MetaAd[]) => void;
  setLinkedInAds?: (ads: MetaAd[]) => void;
  campaignData?: any;
}

export const useImageGenerationHandler = (props?: UseImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async (adOrPrompt: MetaAd | string, indexOrOptions?: number | any): Promise<string | void> => {
    try {
      // Determine if we're using the old or new API pattern
      let ad: MetaAd | undefined;
      let index: number = -1;
      let prompt: string = '';
      let options: any = {};
      
      // Handle different calling patterns
      if (typeof adOrPrompt === 'string') {
        // New API: (prompt, options)
        prompt = adOrPrompt;
        options = indexOrOptions || {};
        index = options.index !== undefined ? options.index : -1;
        ad = options.ad;
      } else {
        // Old API: (ad, index)
        ad = adOrPrompt;
        index = indexOrOptions as number;
        prompt = ad?.imagePrompt || ad?.description || ad?.primaryText?.split('#')[0] || "";
        options = {
          companyName: props?.campaignData?.name || '',
          brandTone: props?.campaignData?.brandTone || 'professional',
          industry: props?.campaignData?.industry || '',
          format: ad?.format || 'square'
        };
      }
      
      if (!prompt) {
        toast({
          title: "Missing image prompt",
          description: "Not enough content to generate an image.",
          variant: "destructive"
        });
        return;
      }

      setLoadingImageIndex(index);
      toast({
        title: "Generating image...",
        description: "This may take a few moments.",
      });
      
      console.log(`Generating image with prompt: ${prompt}`);
      console.log(`Additional info:`, options);
      
      const imageUrl = await generateAdImage(prompt, options);
      
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }
      
      console.log(`Image generated successfully: ${imageUrl}`);
      
      // Update ad with new image if we're using the old API pattern and have props
      if (ad && props) {
        if (props.metaAds && props.setMetaAds && index < (props.metaAds.length || 0)) {
          const updatedAds = [...props.metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          props.setMetaAds(updatedAds);
          
          console.log(`Updated Meta ad at index ${index} with new image URL`);
        } else if (props.linkedInAds && props.setLinkedInAds) {
          const linkedInIndex = index - (props.metaAds?.length || 0);
          if (linkedInIndex >= 0 && linkedInIndex < props.linkedInAds.length) {
            const updatedAds = [...props.linkedInAds];
            updatedAds[linkedInIndex] = { ...updatedAds[linkedInIndex], imageUrl };
            props.setLinkedInAds(updatedAds);
            
            console.log(`Updated LinkedIn ad at index ${linkedInIndex} with new image URL`);
          }
        }
      }
      
      toast({
        title: "Image generated",
        description: "The ad image has been generated successfully."
      });
      
      return imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return undefined;
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateImage,
    loadingImageIndex
  };
};

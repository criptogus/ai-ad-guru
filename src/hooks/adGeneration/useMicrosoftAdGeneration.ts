
import { useState } from "react";
import { GoogleAd } from "./types"; 
import { generateAds } from "@/services/ads/adGeneration/adGenerationService";
import { normalizeGoogleAd } from "@/lib/utils";

interface MicrosoftAdGenerationProps {
  onSuccess?: (ads: GoogleAd[]) => void;
  onError?: (error: any) => void;
}

export const useMicrosoftAdGeneration = (props?: MicrosoftAdGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateMicrosoftAds = async (
    data: {
      companyName: string;
      companyDescription?: string;
      targetAudience?: string;
      keywords?: string[];
      mindTrigger?: string;
      industry?: string;
      language?: string;
      websiteUrl?: string;
      objective?: string;
      differentials?: string[];
      brandTone?: string;
      product?: string;
    }
  ): Promise<GoogleAd[] | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating Microsoft Ads with data:", data);
      
      // Prepare the data for the OpenAI prompt
      const promptData = {
        companyName: data.companyName,
        websiteUrl: data.websiteUrl || `https://${data.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        objective: data.objective || (data.companyDescription ? `Promote ${data.companyName}` : 'Increase brand awareness'),
        targetAudience: data.targetAudience || 'General audience',
        language: data.language || 'portuguese',
        brandTone: data.brandTone || 'balanced',
        differentials: data.differentials || [],
        product: data.product || '',
        industry: data.industry || '',
        mindTrigger: data.mindTrigger || '',
        platforms: ['microsoft']
      };
      
      // Generate ads using the service
      const result = await generateAds(promptData);
      
      if (!result) {
        throw new Error("Failed to generate Microsoft Ads");
      }
      
      // Extract Microsoft Ads from the response
      const microsoftAds = result.microsoft_ads || [];
      
      if (microsoftAds.length === 0) {
        throw new Error("No Microsoft Ads were generated");
      }
      
      console.log("Generated Microsoft Ads:", microsoftAds);
      
      // Transform the OpenAI response into our app's ad format
      const transformedAds = microsoftAds.map(ad => normalizeGoogleAd(ad));
      
      if (props?.onSuccess) {
        props.onSuccess(transformedAds);
      }
      
      return transformedAds;
    } catch (err) {
      console.error("Error generating Microsoft Ads:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      if (props?.onError) {
        props.onError(err);
      }
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMicrosoftAds,
    isGenerating,
    error,
    clearError: () => setError(null)
  };
};

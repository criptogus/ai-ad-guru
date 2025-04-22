
import { useState } from "react";
import { MetaAd } from "./types";
import { generateAds } from "@/services/ads/adGeneration/adGenerationService";
import { normalizeMetaAd } from "@/lib/utils";

interface MetaAdGenerationProps {
  onSuccess?: (ads: MetaAd[]) => void;
  onError?: (error: any) => void;
}

export const useMetaAdGeneration = (props?: MetaAdGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateMetaAds = async (
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
  ): Promise<MetaAd[] | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating Meta Ads with data:", data);
      
      // Prepare the data for the OpenAI prompt
      const promptData = {
        companyName: data.companyName,
        websiteUrl: data.websiteUrl || `https://${data.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        objective: data.objective || (data.companyDescription ? `Promote ${data.companyName}` : 'Increase brand awareness'),
        targetAudience: data.targetAudience || 'General audience',
        language: data.language || 'portuguese',
        brandTone: data.brandTone || 'engaging',
        differentials: data.differentials || [],
        product: data.product || '',
        industry: data.industry || '',
        mindTrigger: data.mindTrigger || '',
        platforms: ['meta', 'instagram']
      };
      
      // Generate ads using the service
      const result = await generateAds(promptData);
      
      if (!result) {
        throw new Error("Failed to generate Meta Ads");
      }
      
      // Extract Meta/Instagram Ads from the response
      // Check both instagram_ads and meta_ads properties
      const metaAds = result.meta_ads || result.instagram_ads || [];
      
      if (metaAds.length === 0) {
        throw new Error("No Meta Ads were generated");
      }
      
      console.log("Generated Meta Ads:", metaAds);
      
      // Transform the OpenAI response into our app's ad format
      const transformedAds = metaAds.map(ad => normalizeMetaAd(ad));
      
      if (props?.onSuccess) {
        props.onSuccess(transformedAds);
      }
      
      return transformedAds;
    } catch (err) {
      console.error("Error generating Meta Ads:", err);
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
    generateMetaAds,
    isGenerating,
    error,
    clearError: () => setError(null)
  };
};

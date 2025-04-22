
import { useState } from "react";
import { MetaAd } from "./types";
import { generateLinkedInAds } from "@/services/ads/adGeneration/adGenerationService";
import { normalizeMetaAd } from "@/lib/utils";

interface LinkedInAdGenerationProps {
  onSuccess?: (ads: MetaAd[]) => void;
  onError?: (error: any) => void;
}

export const useLinkedInAdGeneration = (props?: LinkedInAdGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateLinkedInAds = async (
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
    },
    mindTrigger?: string
  ): Promise<MetaAd[] | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating LinkedIn Ads with data:", data);
      
      // Prepare the data for the OpenAI prompt
      const promptData = {
        companyName: data.companyName,
        websiteUrl: data.websiteUrl || `https://${data.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        objective: data.objective || (data.companyDescription ? `Promote ${data.companyName}` : 'Increase brand awareness'),
        targetAudience: data.targetAudience || 'Professional audience',
        language: data.language || 'portuguese',
        brandTone: data.brandTone || 'professional',
        differentials: data.differentials || [],
        product: data.product || '',
        industry: data.industry || '',
        mindTrigger: mindTrigger || data.mindTrigger || '',
        platforms: ['linkedin']
      };
      
      // Generate ads using the service
      const linkedInAds = await generateLinkedInAds(promptData, mindTrigger || data.mindTrigger);
      
      if (!linkedInAds || linkedInAds.length === 0) {
        throw new Error("No LinkedIn Ads were generated");
      }
      
      console.log("Generated LinkedIn Ads:", linkedInAds);
      
      // Transform the OpenAI response into our app's ad format
      const transformedAds = linkedInAds.map(ad => normalizeMetaAd(ad));
      
      if (props?.onSuccess) {
        props.onSuccess(transformedAds);
      }
      
      return transformedAds;
    } catch (err) {
      console.error("Error generating LinkedIn Ads:", err);
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
    generateLinkedInAds,
    isGenerating,
    error,
    clearError: () => setError(null)
  };
};

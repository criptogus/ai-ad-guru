
import { useState } from "react";
import { GoogleAd } from "./types";
import { generateAds } from "@/services/ads/adGeneration/adGenerationService";
import { normalizeGoogleAd } from "@/lib/utils";

interface GoogleAdGenerationProps {
  onSuccess?: (ads: GoogleAd[]) => void;
  onError?: (error: any) => void;
}

export const useGoogleAdGeneration = (props?: GoogleAdGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateGoogleAds = async (
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
      console.log("Generating Google Ads with data:", data);
      
      // Prepare the data for the OpenAI prompt
      const promptData = {
        companyName: data.companyName,
        websiteUrl: data.websiteUrl || `https://${data.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        objective: data.objective || (data.companyDescription ? `Promote ${data.companyName}` : 'Increase brand awareness'),
        targetAudience: data.targetAudience || 'General audience',
        language: data.language || 'portuguese',
        brandTone: data.brandTone || 'professional',
        differentials: data.differentials || [],
        product: data.product || '',
        industry: data.industry || '',
        mindTrigger: data.mindTrigger || ''
      };
      
      // Generate ads using the service
      const result = await generateAds(promptData);
      
      if (!result) {
        throw new Error("Failed to generate Google Ads");
      }
      
      // Extract Google Ads from the response
      const googleAds = result.google_ads || [];
      
      if (googleAds.length === 0) {
        throw new Error("No Google Ads were generated");
      }
      
      console.log("Generated Google Ads:", googleAds);
      
      // Transform the OpenAI response into our app's ad format
      const transformedAds = googleAds.map(ad => normalizeGoogleAd(ad));
      
      if (props?.onSuccess) {
        props.onSuccess(transformedAds);
      }
      
      return transformedAds;
    } catch (err) {
      console.error("Error generating Google Ads:", err);
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
    generateGoogleAds,
    isGenerating,
    error,
    clearError: () => setError(null)
  };
};

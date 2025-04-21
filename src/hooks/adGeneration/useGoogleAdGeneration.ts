
import { useState } from "react";
import { GoogleAd } from "./types";
import { toast } from "sonner";
import { getHeadlineOptions, getDescriptionOptions } from "@/services/ads/google/options";
import { useCredits } from "@/contexts/CreditsContext";
import { generateGoogleAds } from "@/services/api/googleApi";

interface UseGoogleAdGenerationProps {
  defaultParams?: any;
}

export const useGoogleAdGeneration = ({
  defaultParams = {}
}: UseGoogleAdGenerationProps = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deductCredits } = useCredits();

  /**
   * Normalize Google ad text to ensure proper spacing after periods
   */
  const normalizeAdText = (ad: GoogleAd): GoogleAd => {
    // Fix spacing after periods in all headlines and descriptions
    const fixSpacing = (text: string) => {
      if (!text) return text;
      // Replace a period followed directly by a character with a period, space, and that character
      return text.replace(/\.(\S)/g, '. $1');
    };

    // Create new ad object with fixed text
    return {
      ...ad,
      headline1: fixSpacing(ad.headline1),
      headline2: fixSpacing(ad.headline2),
      headline3: fixSpacing(ad.headline3),
      description1: fixSpacing(ad.description1),
      description2: fixSpacing(ad.description2),
      headlines: ad.headlines?.map(fixSpacing) || [],
      descriptions: ad.descriptions?.map(fixSpacing) || [],
    };
  };

  const handleGenerate = async (params: any = {}): Promise<GoogleAd[]> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Generating Google ads with params:", { ...defaultParams, ...params });
      
      // Generate the ads
      let generatedAds = await generateGoogleAds(params);
      
      if (!generatedAds) {
        // Provide some mock data if API call fails
        generatedAds = [{
          headline1: "Example Headline 1",
          headline2: "Example Headline 2",
          headline3: "Example Headline 3",
          description1: "Example description 1 for the ad.",
          description2: "Example description 2 for the ad.",
          headlines: ["Example Headline 1", "Example Headline 2", "Example Headline 3"],
          descriptions: ["Example description 1 for the ad.", "Example description 2 for the ad."],
          path1: "example",
          path2: "path",
          finalUrl: "https://example.com",
          siteLinks: [],
          displayPath: "example.com/path"
        }];
      }
      
      // Fix spacing after periods in all ads
      generatedAds = generatedAds.map(normalizeAdText);
      
      console.log("Generated Google ads:", generatedAds);
      
      // Apply credit deduction if available
      if (deductCredits) {
        // Standard cost for Google Ads generation
        deductCredits(5);
        toast.success("Google Ads Generated", { 
          description: "5 credits used for Google Ads generation"
        });
      }
      
      return generatedAds;
    } catch (err) {
      console.error("Error generating Google ads:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      
      toast.error("Failed to generate Google ads", {
        description: err instanceof Error ? err.message : "An unknown error occurred"
      });
      
      return [];
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateGoogleAds: handleGenerate,
    isGenerating,
    error
  };
};

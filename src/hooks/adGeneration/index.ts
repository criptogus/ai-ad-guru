
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { WebsiteAnalysisResult } from "../useWebsiteAnalysis";
import { v4 as uuidv4 } from "uuid";

// Types
export interface GoogleAd {
  id?: string;
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  path1: string;
  path2: string;
  displayPath?: string;
  siteLinks?: { title: string; description?: string }[];
}

export interface MetaAd {
  id?: string;
  primaryText: string;
  headline: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export const useAdGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateGoogleAds = useCallback(
    async (
      analysisResult: WebsiteAnalysisResult | null,
      campaignData: any,
      mindTrigger?: string
    ): Promise<GoogleAd[]> => {
      if (!analysisResult) {
        toast({
          title: "Missing Data",
          description: "Website analysis is required to generate ads",
          variant: "destructive",
        });
        return [];
      }

      setIsGenerating(true);

      try {
        console.log("Generating Google Ads with:", {
          analysisResult,
          campaignData,
          mindTrigger,
        });

        const { data, error } = await supabase.functions.invoke("generate-ads", {
          body: {
            type: "google",
            analysisResult,
            campaignData,
            mindTrigger,
            count: 5,
          },
        });

        if (error) {
          console.error("Error generating Google Ads:", error);
          throw error;
        }

        console.log("Google Ads generation result:", data);

        const ads = data.ads.map((ad: GoogleAd) => ({
          ...ad,
          id: uuidv4(),
        }));

        toast({
          title: "Google Ads Generated",
          description: `Successfully created ${ads.length} ad variations`,
        });

        return ads;
      } catch (error: any) {
        console.error("Failed to generate Google Ads:", error);
        toast({
          title: "Google Ads Generation Failed",
          description: error.message || "Failed to generate Google Ads",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsGenerating(false);
      }
    },
    [toast]
  );

  const generateMetaAds = useCallback(
    async (
      analysisResult: WebsiteAnalysisResult | null,
      campaignData: any,
      mindTrigger?: string
    ): Promise<MetaAd[]> => {
      if (!analysisResult) {
        toast({
          title: "Missing Data",
          description: "Website analysis is required to generate ads",
          variant: "destructive",
        });
        return [];
      }

      setIsGenerating(true);

      try {
        console.log("Generating Meta Ads with:", {
          analysisResult,
          campaignData,
          mindTrigger,
        });

        const { data, error } = await supabase.functions.invoke("generate-ads", {
          body: {
            type: "meta",
            analysisResult,
            campaignData,
            mindTrigger,
            count: 3,
          },
        });

        if (error) {
          console.error("Error generating Meta Ads:", error);
          throw error;
        }

        console.log("Meta Ads generation result:", data);

        const ads = data.ads.map((ad: MetaAd) => ({
          ...ad,
          id: uuidv4(),
        }));

        toast({
          title: "Meta Ads Generated",
          description: `Successfully created ${ads.length} ad variations`,
        });

        return ads;
      } catch (error: any) {
        console.error("Failed to generate Meta Ads:", error);
        toast({
          title: "Meta Ads Generation Failed",
          description: error.message || "Failed to generate Meta Ads",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsGenerating(false);
      }
    },
    [toast]
  );

  const generateLinkedInAds = useCallback(
    async (
      analysisResult: WebsiteAnalysisResult | null,
      campaignData: any,
      mindTrigger?: string
    ): Promise<MetaAd[]> => {
      if (!analysisResult) {
        toast({
          title: "Missing Data",
          description: "Website analysis is required to generate ads",
          variant: "destructive",
        });
        return [];
      }

      setIsGenerating(true);

      try {
        console.log("Generating LinkedIn Ads with:", {
          analysisResult,
          campaignData,
          mindTrigger,
        });

        const { data, error } = await supabase.functions.invoke("generate-ads", {
          body: {
            type: "linkedin",
            analysisResult,
            campaignData,
            mindTrigger,
            count: 3,
          },
        });

        if (error) {
          console.error("Error generating LinkedIn Ads:", error);
          throw error;
        }

        console.log("LinkedIn Ads generation result:", data);

        const ads = data.ads.map((ad: MetaAd) => ({
          ...ad,
          id: uuidv4(),
        }));

        toast({
          title: "LinkedIn Ads Generated",
          description: `Successfully created ${ads.length} ad variations`,
        });

        return ads;
      } catch (error: any) {
        console.error("Failed to generate LinkedIn Ads:", error);
        toast({
          title: "LinkedIn Ads Generation Failed",
          description: error.message || "Failed to generate LinkedIn Ads",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsGenerating(false);
      }
    },
    [toast]
  );

  const generateMicrosoftAds = useCallback(
    async (
      analysisResult: WebsiteAnalysisResult | null,
      campaignData: any,
      mindTrigger?: string
    ): Promise<GoogleAd[]> => {
      if (!analysisResult) {
        toast({
          title: "Missing Data",
          description: "Website analysis is required to generate ads",
          variant: "destructive",
        });
        return [];
      }

      setIsGenerating(true);

      try {
        console.log("Generating Microsoft Ads with:", {
          analysisResult,
          campaignData,
          mindTrigger,
        });

        const { data, error } = await supabase.functions.invoke("generate-ads", {
          body: {
            type: "microsoft",
            analysisResult,
            campaignData,
            mindTrigger,
            count: 5,
          },
        });

        if (error) {
          console.error("Error generating Microsoft Ads:", error);
          throw error;
        }

        console.log("Microsoft Ads generation result:", data);

        const ads = data.ads.map((ad: GoogleAd) => ({
          ...ad,
          id: uuidv4(),
        }));

        toast({
          title: "Microsoft Ads Generated",
          description: `Successfully created ${ads.length} ad variations`,
        });

        return ads;
      } catch (error: any) {
        console.error("Failed to generate Microsoft Ads:", error);
        toast({
          title: "Microsoft Ads Generation Failed",
          description: error.message || "Failed to generate Microsoft Ads",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsGenerating(false);
      }
    },
    [toast]
  );

  const generateAdImage = useCallback(
    async (
      ad: MetaAd,
      campaignData: any
    ): Promise<{ imageUrl: string; prompt: string } | null> => {
      setIsGenerating(true);

      try {
        const prompt = ad.imagePrompt || `Create an advertisement image for ${campaignData.companyName || "a company"}`;
        
        console.log("Generating image with prompt:", prompt);

        const { data, error } = await supabase.functions.invoke("generate-image", {
          body: {
            prompt,
            campaignData,
          },
        });

        if (error) {
          console.error("Error generating image:", error);
          throw error;
        }

        console.log("Image generation result:", data);

        toast({
          title: "Image Generated",
          description: "Successfully created ad image",
        });

        return {
          imageUrl: data.imageUrl,
          prompt: prompt,
        };
      } catch (error: any) {
        console.error("Failed to generate image:", error);
        toast({
          title: "Image Generation Failed",
          description: error.message || "Failed to generate image",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [toast]
  );

  return {
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage,
    isGenerating,
  };
};

// Export types and hook
export * from "./types";

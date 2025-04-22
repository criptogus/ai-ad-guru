
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';

interface UseAdGenerationHandlersProps {
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<any[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<any[]>>;
  createCampaign: any;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>;
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (campaignData: any) => Promise<any[] | null>;
  generateMicrosoftAds: (campaignData: any) => Promise<any[] | null>;
}

export const useAdGenerationHandlers = ({
  analysisResult,
  campaignData,
  setGoogleAds,
  setMetaAds,
  setLinkedInAds,
  setMicrosoftAds,
  createCampaign,
  setIsCreating,
  generateGoogleAds,
  generateMetaAds,
  generateLinkedInAds,
  generateMicrosoftAds
}: UseAdGenerationHandlersProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  // Handler for all ads generated from AdGenerationStep component
  const handleAdsGenerated = (adsData: Record<string, any[]>) => {
    console.log("Handling generated ads:", adsData);
    
    // Process the ads by platform
    if (adsData.google && Array.isArray(adsData.google)) {
      setGoogleAds(adsData.google);
    }
    
    if (adsData.meta && Array.isArray(adsData.meta)) {
      setMetaAds(adsData.meta);
    }
    
    if (adsData.linkedin && Array.isArray(adsData.linkedin)) {
      setLinkedInAds(adsData.linkedin);
    }
    
    if (adsData.microsoft && Array.isArray(adsData.microsoft)) {
      setMicrosoftAds(adsData.microsoft);
    }
    
    toast({
      title: "Ad Generation Complete",
      description: `Ads generated for ${Object.keys(adsData).length} platforms.`
    });
  };

  // Individual platform ad generation handlers
  const handleGenerateGoogleAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Google Ads",
        description: "Creating 5 new ad variations"
      });
      
      const mindTrigger = campaignData.mindTriggers?.google || '';
      const ads = await generateGoogleAds({
        ...campaignData, 
        mindTrigger,
        platforms: ['google']
      });
      
      if (ads && ads.length > 0) {
        setGoogleAds(ads);
        toast({
          title: "Google Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
    } catch (error) {
      console.error("Failed to generate Google Ads:", error);
      toast({
        title: "Google Ads Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate ads",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Similar handlers for Meta, LinkedIn, and Microsoft ads
  const handleGenerateMetaAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Instagram Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.meta || '';
      const ads = await generateMetaAds({
        ...campaignData,
        mindTrigger,
        platforms: ['meta']
      });
  
      if (ads && ads.length > 0) {
        setMetaAds(ads);
        toast({
          title: "Instagram Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
    } catch (error) {
      console.error("Failed to generate Instagram Ads:", error);
      toast({
        title: "Instagram Ads Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate ads",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLinkedInAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating LinkedIn Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.linkedin || '';
      const ads = await generateLinkedInAds({
        ...campaignData,
        mindTrigger,
        platforms: ['linkedin']
      });
  
      if (ads && ads.length > 0) {
        setLinkedInAds(ads);
        toast({
          title: "LinkedIn Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
    } catch (error) {
      console.error("Failed to generate LinkedIn Ads:", error);
      toast({
        title: "LinkedIn Ads Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate ads",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Microsoft Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.microsoft || '';
      const ads = await generateMicrosoftAds({
        ...campaignData,
        mindTrigger,
        platforms: ['microsoft']
      });
  
      if (ads && ads.length > 0) {
        setMicrosoftAds(ads);
        toast({
          title: "Microsoft Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
    } catch (error) {
      console.error("Failed to generate Microsoft Ads:", error);
      toast({
        title: "Microsoft Ads Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate ads",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleAdsGenerated,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds,
    isGenerating
  };
};

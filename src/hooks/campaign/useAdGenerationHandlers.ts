
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';
import { useNavigate } from 'react-router-dom';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

export interface UseAdGenerationHandlersProps {
  setGoogleAds: (ads: GoogleAd[]) => void;
  setMetaAds: (ads: MetaAd[]) => void;
  setMicrosoftAds: (ads: GoogleAd[]) => void;
  setLinkedInAds: (ads: MetaAd[]) => void;
  campaignData: any;
  createCampaign: any;
  setIsCreating: (isCreating: boolean) => void;
  analysisResult?: WebsiteAnalysisResult | null;
  generateGoogleAds?: (analysisResult: any) => Promise<GoogleAd[] | null>;
  generateMetaAds?: (analysisResult: any) => Promise<MetaAd[] | null>;
  generateMicrosoftAds?: (analysisResult: any) => Promise<GoogleAd[] | null>;
  generateLinkedInAds?: (analysisResult: any) => Promise<MetaAd[] | null>;
}

export const useAdGenerationHandlers = ({
  setGoogleAds,
  setMetaAds,
  setMicrosoftAds,
  setLinkedInAds,
  campaignData,
  createCampaign,
  setIsCreating,
  analysisResult,
  generateGoogleAds,
  generateMetaAds,
  generateMicrosoftAds,
  generateLinkedInAds
}: UseAdGenerationHandlersProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAdsGenerated = (generatedAds: any) => {
    if (!generatedAds) return;

    if (generatedAds.google_ads) {
      setGoogleAds(generatedAds.google_ads);
    }
    if (generatedAds.meta_ads) {
      setMetaAds(generatedAds.meta_ads);
    }
    if (generatedAds.linkedin_ads) {
      setLinkedInAds(generatedAds.linkedin_ads);
    }
    if (generatedAds.microsoft_ads) {
      setMicrosoftAds(generatedAds.microsoft_ads);
    }
  };

  const handleCreateCampaign = async (): Promise<void> => {
    setIsCreating(true);
    try {
      const result = await createCampaign();
      if (result) {
        toast({
          title: "Campaign Created",
          description: "Your campaign has been created successfully."
        });
        navigate('/campaigns');
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Failed to create the campaign. Please try again."
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Add handlers for generating different types of ads
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult || !generateGoogleAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads."
      });
      return;
    }
    
    try {
      const ads = await generateGoogleAds(analysisResult);
      if (ads && ads.length > 0) {
        setGoogleAds(ads);
        toast({
          title: "Google Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`
        });
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate Google ads. Please try again."
      });
    }
  };

  const handleGenerateMetaAds = async () => {
    if (!analysisResult || !generateMetaAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads."
      });
      return;
    }
    
    try {
      const ads = await generateMetaAds(analysisResult);
      if (ads && ads.length > 0) {
        setMetaAds(ads);
        toast({
          title: "Meta Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`
        });
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate Meta ads. Please try again."
      });
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult || !generateMicrosoftAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads."
      });
      return;
    }
    
    try {
      const ads = await generateMicrosoftAds(analysisResult);
      if (ads && ads.length > 0) {
        setMicrosoftAds(ads);
        toast({
          title: "Microsoft Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`
        });
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate Microsoft ads. Please try again."
      });
    }
  };

  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult || !generateLinkedInAds) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Website analysis data is required to generate ads."
      });
      return;
    }
    
    try {
      const ads = await generateLinkedInAds(analysisResult);
      if (ads && ads.length > 0) {
        setLinkedInAds(ads);
        toast({
          title: "LinkedIn Ads Generated",
          description: `Successfully created ${ads.length} ad variations.`
        });
      }
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate LinkedIn ads. Please try again."
      });
    }
  };

  return {
    handleAdsGenerated,
    handleCreateCampaign,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateLinkedInAds
  };
};

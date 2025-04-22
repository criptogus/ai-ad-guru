
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';
import { useNavigate } from 'react-router-dom';

export interface UseAdGenerationHandlersProps {
  setGoogleAds: (ads: GoogleAd[]) => void;
  setMetaAds: (ads: MetaAd[]) => void;
  setMicrosoftAds: (ads: GoogleAd[]) => void;
  setLinkedInAds: (ads: MetaAd[]) => void;
  campaignData: any;
  createCampaign: any;
  setIsCreating: (isCreating: boolean) => void;
}

export const useAdGenerationHandlers = ({
  setGoogleAds,
  setMetaAds,
  setMicrosoftAds,
  setLinkedInAds,
  campaignData,
  createCampaign,
  setIsCreating
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

  return {
    handleAdsGenerated,
    handleCreateCampaign
  };
};


import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export interface CampaignCreationParams {
  name: string;
  description?: string;
  platforms: string[];
  budget?: number;
  budgetType?: 'daily' | 'lifetime'; // Restrict to these literal types
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  objective?: string;
  googleAds?: GoogleAd[];
  metaAds?: MetaAd[];
  microsoftAds?: GoogleAd[];
  linkedInAds?: MetaAd[];
  targetUrl?: string;
  websiteUrl?: string;
  mindTriggers?: Record<string, string>;
}

export const useCampaignCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createCampaign = async (params: CampaignCreationParams) => {
    setIsCreating(true);
    
    try {
      // Ensure all required fields are present
      if (!params.name) {
        params.name = "New Campaign";
      }
      
      if (!params.description) {
        params.description = "";
      }
      
      if (!params.platforms || params.platforms.length === 0) {
        params.platforms = ["google"];
      }
      
      if (!params.budget) {
        params.budget = 100;
      }
      
      if (!params.budgetType) {
        params.budgetType = 'daily';
      }
      
      if (!params.startDate) {
        params.startDate = new Date().toISOString().split('T')[0];
      }
      
      if (!params.targetAudience) {
        params.targetAudience = "";
      }
      
      if (!params.objective) {
        params.objective = "awareness";
      }
      
      console.log("Creating campaign with params:", params);
      
      // Return a placeholder success result
      return {
        id: Math.random().toString(36).substring(2, 15),
        success: true,
        ...params
      };
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        variant: "destructive",
        title: "Campaign Creation Failed",
        description: "There was an error creating your campaign. Please try again."
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCampaign,
    isCreating
  };
};

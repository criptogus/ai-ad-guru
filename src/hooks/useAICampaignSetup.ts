
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { ScheduleData } from "@/types/campaign";

interface CampaignSetupData {
  name: string;
  description: string;
  targetAudience: string;
  keywords: string;
  budget: number;
  objective: string;
  startDate: string;
  endDate?: string;
  optimizationFrequency: string;
}

export const useAICampaignSetup = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCampaignSetup = async (
    websiteInfo: WebsiteAnalysisResult,
    platform: string
  ): Promise<Partial<CampaignSetupData> | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-campaign-setup", {
        body: { websiteInfo, platform }
      });

      if (error) {
        console.error("Error generating campaign setup:", error);
        toast({
          title: "Generation Failed",
          description: "Failed to generate campaign setup data. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Setup Generated",
        description: "Campaign setup data has been generated successfully!"
      });

      // Format the data to match the expected structure
      const formattedData: Partial<CampaignSetupData> = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined
      };

      return formattedData;
    } catch (error) {
      console.error("Error in generateCampaignSetup:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate campaign setup",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCampaignSetup,
    isGenerating
  };
};

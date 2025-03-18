
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BasicInfoTab from "./setup/BasicInfoTab";
import TargetingTab from "./setup/TargetingTab";
import AdvancedSettingsTab from "./setup/AdvancedSettingsTab";
import AiTargetingButton from "./setup/AiTargetingButton";

interface CampaignSetupProps {
  analysisResult: WebsiteAnalysisResult;
  campaignData: any;
  onUpdateCampaignData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
}

const CampaignSetupStep: React.FC<CampaignSetupProps> = ({
  analysisResult,
  campaignData,
  onUpdateCampaignData,
  onBack,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isGeneratingTargeting, setIsGeneratingTargeting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill the campaign data from the analysis result if not already set
    if (analysisResult && !campaignData.name) {
      onUpdateCampaignData({
        ...campaignData,
        name: `${analysisResult.companyName} Campaign`,
        description: analysisResult.businessDescription,
        targetAudience: analysisResult.targetAudience,
        // Default values for new fields
        targetUrl: analysisResult.websiteUrl || "",
        language: "en",
        country: "US",
        device: ["desktop", "mobile", "tablet"],
        bidStrategy: "maximize_conversions",
        ageRange: "18-65+",
        gender: "all",
      });
    }
  }, [analysisResult, campaignData, onUpdateCampaignData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateCampaignData({
      ...campaignData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    onUpdateCampaignData({
      ...campaignData,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (name: string, value: string) => {
    const currentValues = Array.isArray(campaignData[name]) ? campaignData[name] : [];
    
    if (currentValues.includes(value)) {
      // Remove the value if it's already selected
      onUpdateCampaignData({
        ...campaignData,
        [name]: currentValues.filter((v: string) => v !== value),
      });
    } else {
      // Add the value if it's not already selected
      onUpdateCampaignData({
        ...campaignData,
        [name]: [...currentValues, value],
      });
    }
  };

  // Function to generate AI-based targeting recommendations
  const generateTargetingRecommendations = async () => {
    if (!analysisResult) {
      toast({
        title: "Missing Data",
        description: "Website analysis data is required to generate targeting recommendations",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingTargeting(true);
    try {
      console.log('Starting targeting recommendation generation with data:', {
        businessDescription: analysisResult.businessDescription,
        targetAudience: analysisResult.targetAudience,
      });
      
      // Call Supabase edge function to generate targeting recommendations
      const { data, error } = await supabase.functions.invoke('generate-targeting', {
        body: { 
          businessDescription: analysisResult.businessDescription,
          targetAudience: analysisResult.targetAudience,
          keywords: analysisResult.keywords,
          brandTone: analysisResult.brandTone,
          uniqueSellingPoints: analysisResult.uniqueSellingPoints
        },
      });

      console.log('Response from generate-targeting:', { data, error });

      if (error) {
        console.error('Error generating targeting recommendations:', error);
        throw error;
      }

      if (!data.success) {
        console.error('Targeting recommendation generation failed:', data.error);
        throw new Error(data.error || "Failed to generate targeting recommendations");
      }

      console.log('Successfully generated targeting recommendations:', data.data);

      // Update the campaign data with the AI recommendations
      onUpdateCampaignData({
        ...campaignData,
        ...data.data
      });
      
      toast({
        title: "Targeting Generated",
        description: "AI-based targeting recommendations have been applied",
      });
      
      // Switch to targeting tab to show the generated recommendations
      setActiveTab("targeting");
      
    } catch (error) {
      console.error('Error generating targeting recommendations:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate targeting recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTargeting(false);
    }
  };

  const isDeviceSelected = (device: string) => {
    return Array.isArray(campaignData.device) && campaignData.device.includes(device);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Setup</CardTitle>
        <CardDescription>
          Review and customize your campaign details based on the AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <AiTargetingButton 
            isGeneratingTargeting={isGeneratingTargeting}
            generateTargetingRecommendations={generateTargetingRecommendations}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfoTab
              campaignData={campaignData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          </TabsContent>
          
          <TabsContent value="targeting">
            <TargetingTab
              campaignData={campaignData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleMultiSelectChange={handleMultiSelectChange}
              isDeviceSelected={isDeviceSelected}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedSettingsTab
              campaignData={campaignData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSetupStep;

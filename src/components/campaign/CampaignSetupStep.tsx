
import React, { useState, useEffect } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

import BasicInfoTab from "./setup/BasicInfoTab";
import AudienceTab from "./setup/AudienceTab";
import ScheduleTab from "./setup/ScheduleTab";
import AiFillButton from "./setup/AiFillButton";
import { useAICampaignSetup } from "@/hooks/useAICampaignSetup";
import { ScheduleData, CampaignBasicInfo, CampaignTargeting } from "@/types/campaign";

const requiredFields = {
  basic: ["name", "description", "targetUrl", "budget", "objective"],
  audience: ["targetAudience"],
  schedule: ["startDate"]
};

interface CampaignSetupStepProps {
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  onUpdateCampaignData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const CampaignSetupStep: React.FC<CampaignSetupStepProps> = ({
  analysisResult,
  campaignData,
  onUpdateCampaignData,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isValid, setIsValid] = useState<Record<string, boolean>>({
    basic: false,
    audience: false,
    schedule: false
  });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const { generateCampaignSetup, isGenerating } = useAICampaignSetup();

  useEffect(() => {
    if (analysisResult?.websiteUrl && !campaignData.targetUrl) {
      handleUpdateCampaignData({ targetUrl: analysisResult.websiteUrl });
    }
  }, [analysisResult]);

  useEffect(() => {
    validateFields();
  }, [campaignData, touchedFields]);

  const validateFields = () => {
    const newErrors: Record<string, string | null> = {};
    const newIsValid: Record<string, boolean> = {
      basic: true,
      audience: true, 
      schedule: true
    };

    Object.entries(requiredFields).forEach(([tab, fields]) => {
      fields.forEach(field => {
        const value = campaignData[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          if (touchedFields[field]) {
            newErrors[field] = "This field is required";
          }
          newIsValid[tab as keyof typeof newIsValid] = false;
        } else {
          newErrors[field] = null;
        }
      });
    });

    if (campaignData.budget && Number(campaignData.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0";
      newIsValid.basic = false;
    }

    setErrors(newErrors);
    setIsValid(newIsValid);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleUpdateCampaignData({ [name]: value });
    
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    handleUpdateCampaignData({ [name]: value });
    
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleDateChange = (name: string, value: Date | null) => {
    handleUpdateCampaignData({ [name]: value });
    
    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleUpdateCampaignData = (data: any) => {
    onUpdateCampaignData({
      ...campaignData,
      ...data,
    });
  };

  const handleAIFill = async () => {
    if (!analysisResult) return;
    
    // Determine active platform from campaign data, default to "google"
    const platform = campaignData.platforms && campaignData.platforms.length > 0 
      ? campaignData.platforms[0] 
      : "google";
      
    const setupData = await generateCampaignSetup(analysisResult, platform);
    
    if (setupData) {
      // Convert startDate and endDate strings to Date objects
      const formattedData = {
        ...setupData,
        startDate: setupData.startDate ? new Date(setupData.startDate) : null,
        endDate: setupData.endDate ? new Date(setupData.endDate) : null,
      };
      
      handleUpdateCampaignData(formattedData);
      
      // Mark all fields as touched to trigger validation
      const newTouchedFields: Record<string, boolean> = {};
      Object.values(requiredFields).flat().forEach(field => {
        newTouchedFields[field] = true;
      });
      setTouchedFields(prev => ({ ...prev, ...newTouchedFields }));
    }
  };

  const isFormValid = isValid.basic && isValid.audience && isValid.schedule;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Setup</CardTitle>
        <CardDescription>
          Configure your campaign details. Fields marked with <span className="text-red-500">*</span> are required.
        </CardDescription>
        {analysisResult && (
          <div className="mt-4">
            <AiFillButton 
              isGenerating={isGenerating}
              onClick={handleAIFill}
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Let AI suggest campaign details based on your website analysis
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic" className="relative">
              Basic Info
              {!isValid.basic && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="audience" className="relative">
              Target Audience
              {!isValid.audience && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="schedule" className="relative">
              Schedule
              {!isValid.schedule && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoTab
              campaignData={campaignData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="audience">
            <AudienceTab
              campaignData={campaignData}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleTab
              campaignData={campaignData}
              handleDateChange={handleDateChange}
              handleSelectChange={handleSelectChange}
              errors={errors}
            />
          </TabsContent>
        </Tabs>

        {!isFormValid && Object.values(touchedFields).some(Boolean) && (
          <Alert variant="destructive" className="mt-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required fields to proceed
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-6 mt-6 border-t flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!isFormValid}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSetupStep;

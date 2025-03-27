
import React, { useState, useEffect } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoCircle } from "lucide-react";

import BasicInfoTab from "./setup/BasicInfoTab";
import AudienceTab from "./setup/AudienceTab";
import ScheduleTab from "./setup/ScheduleTab";
import { ScheduleData } from "@/types/campaign";

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

  // Initialize with website URL if available
  useEffect(() => {
    if (analysisResult?.websiteUrl && !campaignData.targetUrl) {
      handleUpdateCampaignData({ targetUrl: analysisResult.websiteUrl });
    }
  }, [analysisResult]);

  // Validate fields whenever campaignData changes
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

    // Validate all required fields
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

    // Additional budget validation
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

  const isFormValid = isValid.basic && isValid.audience && isValid.schedule;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Setup</CardTitle>
        <CardDescription>
          Configure your campaign details. Fields marked with <span className="text-red-500">*</span> are required.
        </CardDescription>
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
            <InfoCircle className="h-4 w-4" />
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

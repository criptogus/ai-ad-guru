
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  useEffect(() => {
    // Pre-fill the campaign data from the analysis result if not already set
    if (analysisResult && !campaignData.name) {
      onUpdateCampaignData({
        ...campaignData,
        name: `${analysisResult.companyName} Campaign`,
        description: analysisResult.businessDescription,
        targetAudience: analysisResult.targetAudience,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Setup</CardTitle>
        <CardDescription>
          Review and customize your campaign details based on the AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              value={campaignData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={campaignData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Textarea
              id="targetAudience"
              name="targetAudience"
              rows={2}
              value={campaignData.targetAudience}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Daily Budget ($)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                min="5"
                value={campaignData.budget}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objective">Campaign Objective</Label>
              <Select 
                value={campaignData.objective} 
                onValueChange={(value) => handleSelectChange("objective", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traffic">Website Traffic</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="leads">Lead Generation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={onNext}>
              Next Step
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSetupStep;

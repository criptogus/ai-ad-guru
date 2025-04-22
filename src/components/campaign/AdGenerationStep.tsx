
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAdGenerationFlow } from '@/hooks/useAdGenerationFlow';
import { CampaignPromptData } from '@/services/ads/adGeneration/types/promptTypes';

interface AdGenerationStepProps {
  analysisResult: any;
  campaignData: any;
  onAdsGenerated: (ads: any) => void;
  platforms: string[];
}

export const AdGenerationStep: React.FC<AdGenerationStepProps> = ({
  analysisResult,
  campaignData,
  onAdsGenerated,
  platforms
}) => {
  const { generateCampaignAds, isGenerating } = useAdGenerationFlow();

  const handleGenerateAds = async () => {
    // Create a comprehensive prompt data object with all available information
    const promptData: CampaignPromptData = {
      companyName: campaignData.companyName || analysisResult?.companyName || campaignData.name,
      websiteUrl: campaignData.targetUrl || campaignData.websiteUrl || '',
      objective: campaignData.objective || 'awareness',
      product: campaignData.product || '',
      targetAudience: campaignData.targetAudience || analysisResult?.targetAudience || '',
      brandTone: campaignData.brandTone || 'professional',
      mindTrigger: campaignData.mindTriggers?.[platforms[0]], // Use first platform's trigger
      language: campaignData.language || 'english',
      industry: campaignData.industry || analysisResult?.industry || '',
      platforms: platforms,
      companyDescription: campaignData.description || analysisResult?.companyDescription || '',
      differentials: analysisResult?.uniqueSellingPoints || []
    };

    // Log what's being sent to OpenAI in a readable format
    console.log('Sending comprehensive data to OpenAI for ad generation:', 
      JSON.stringify(promptData, null, 2)
    );
    
    const generatedAds = await generateCampaignAds(promptData);
    
    if (generatedAds) {
      console.log('Successfully generated ads:', generatedAds);
      onAdsGenerated(generatedAds);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generate Ad Content</h3>
          <p className="text-muted-foreground">
            We'll use AI to create compelling ad content based on your campaign details.
            This will use 5 credits from your account.
          </p>
          
          <div className="rounded-md bg-blue-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Ad Generation Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Company: {campaignData.companyName || analysisResult?.companyName || campaignData.name}</p>
                  <p>Objective: {campaignData.objective || 'Not specified'}</p>
                  <p>Platforms: {platforms.join(', ')}</p>
                  <p>Mind Trigger: {campaignData.mindTriggers?.[platforms[0]] || 'None'}</p>
                  <p>Target Audience: {campaignData.targetAudience || analysisResult?.targetAudience || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateAds} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ads (5 credits)...
              </>
            ) : (
              'Generate Ad Content (5 credits)'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


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
    const promptData: CampaignPromptData = {
      companyName: analysisResult?.companyName || campaignData.name,
      websiteUrl: campaignData.targetUrl,
      objective: campaignData.objective,
      product: campaignData.product,
      targetAudience: analysisResult?.targetAudience || campaignData.targetAudience,
      brandTone: campaignData.brandTone,
      mindTrigger: campaignData.mindTriggers?.[platforms[0]], // Use first platform's trigger
      language: campaignData.language || 'english',
      industry: analysisResult?.industry,
      platforms: platforms,
      companyDescription: analysisResult?.companyDescription || campaignData.description,
      differentials: analysisResult?.uniqueSellingPoints
    };

    console.log('Sending to OpenAI:', promptData);
    const generatedAds = await generateCampaignAds(promptData);
    
    if (generatedAds) {
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
          </p>
          <Button 
            onClick={handleGenerateAds} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ads...
              </>
            ) : (
              'Generate Ad Content'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

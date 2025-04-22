
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAdGenerationFlow } from '@/hooks/useAdGenerationFlow';
import { CampaignPromptData } from '@/services/ads/adGeneration/types/promptTypes';
import { CampaignData } from '@/hooks/useCampaignState';
import { useToast } from '@/hooks/use-toast';

interface AdGenerationStepProps {
  analysisResult: any;
  campaignData: CampaignData;
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
  const { toast } = useToast();

  const handleGenerateAds = async () => {
    if (!platforms || platforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform before generating ads."
      });
      return;
    }

    try {
      const allPlatformAds: Record<string, any> = {};

      for (const platform of platforms) {
        const promptData: CampaignPromptData = {
          companyName: campaignData.companyName || analysisResult?.companyName || campaignData.name,
          websiteUrl: campaignData.targetUrl || campaignData.websiteUrl || '',
          objective: campaignData.objective || 'awareness',
          product: campaignData.product || '',
          targetAudience: campaignData.targetAudience || analysisResult?.targetAudience || '',
          brandTone: campaignData.brandTone || 'professional',
          mindTrigger: campaignData.mindTriggers?.[platform] || '',
          language: campaignData.language || 'english',
          industry: campaignData.industry || analysisResult?.industry || '',
          platforms: [platform],
          companyDescription: campaignData.description || analysisResult?.companyDescription || '',
          differentials: analysisResult?.uniqueSellingPoints || []
        };

        console.log(`Generating ads for ${platform}:`, JSON.stringify(promptData, null, 2));

        toast({
          title: `Generating ${platform} ads`,
          description: `Creating 5 ad variations (5 credits)`
        });

        try {
          const result = await generateCampaignAds(promptData);
          if (result) {
            allPlatformAds[platform] = result;
            toast({
              title: "Success",
              description: `Generated ads for ${platform}`
            });
          }
        } catch (error) {
          console.error(`Failed to generate ads for ${platform}:`, error);
          toast({
            title: "Generation failed",
            description: `Could not generate ads for ${platform}`,
            variant: "destructive"
          });
        }
      }

      // Only proceed if we have some ads
      if (Object.keys(allPlatformAds).length > 0) {
        console.log("Generated ads for platforms:", Object.keys(allPlatformAds));
        onAdsGenerated(allPlatformAds);
      } else {
        toast({
          title: "No ads generated",
          description: "Failed to generate ads for all selected platforms.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error("Ad generation failed:", error);
      toast({
        title: "Ad generation failed",
        description: error instanceof Error ? error.message : "Something went wrong. Try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generate Ad Content</h3>
          <p className="text-muted-foreground">
            We'll use AI to create 5 compelling ad variations for each selected platform based on your campaign details.
            This will use 5 credits per platform from your account.
          </p>

          <div className="rounded-md bg-blue-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Ad Generation Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Company: {campaignData.companyName || analysisResult?.companyName || campaignData.name}</p>
                  <p>Objective: {campaignData.objective || 'Not specified'}</p>
                  <p>Platforms: {platforms.join(', ')}</p>
                  <p>Mind Triggers: {platforms.map(p => `${p}: ${campaignData.mindTriggers?.[p] || 'None'}`).join(', ')}</p>
                  <p>Target Audience: {campaignData.targetAudience || analysisResult?.targetAudience || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateAds} 
            disabled={isGenerating || platforms.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ads...
              </>
            ) : (
              `Generate Ad Content (${platforms.length * 5} credits)`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

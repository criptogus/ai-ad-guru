import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useAdGenerationFlow } from '@/hooks/useAdGenerationFlow';
import { CampaignPromptData } from '@/services/ads/adGeneration/types/promptTypes';
import { CampaignData } from '@/hooks/useCampaignState';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';

interface AdGenerationStepProps {
  analysisResult: any;
  campaignData: CampaignData;
  onAdsGenerated: (ads: Record<string, any[]>) => void;
  platforms: string[];
  onNext?: () => void;
}

export const AdGenerationStep: React.FC<AdGenerationStepProps> = ({
  analysisResult,
  campaignData,
  onAdsGenerated,
  platforms,
  onNext
}) => {
  const { generateCampaignAds, isGenerating } = useAdGenerationFlow();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAds = async () => {
    if (!platforms || platforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform before generating ads."
      });
      return;
    }
    
    // Reset error state
    setError(null);
    
    try {
      const results: Record<string, any[]> = {};
      let hasAnySuccessfulPlatform = false;

      for (const platform of platforms) {
        // Create a more comprehensive prompt data object with all available context
        const promptData: CampaignPromptData = {
          companyName: campaignData.companyName || analysisResult?.companyName || campaignData.name || 'Your Company',
          websiteUrl: campaignData.targetUrl || campaignData.websiteUrl || analysisResult?.websiteUrl || '',
          objective: campaignData.objective || analysisResult?.objective || 'awareness',
          product: campaignData.product || analysisResult?.product || '',
          targetAudience: campaignData.targetAudience || analysisResult?.targetAudience || '',
          brandTone: campaignData.brandTone || analysisResult?.brandTone || 'professional',
          mindTrigger: campaignData.mindTriggers?.[platform] || analysisResult?.mindTrigger || '',
          language: campaignData.language || 'english',
          industry: campaignData.industry || analysisResult?.industry || '',
          platforms: [platform],
          companyDescription: campaignData.description || analysisResult?.companyDescription || analysisResult?.businessDescription || '',
          differentials: analysisResult?.uniqueSellingPoints || [],
          callToAction: analysisResult?.callToAction || 'Learn More',
          keywords: analysisResult?.keywords || []
        };

        toast({
          title: `Generating ${platform} ads`,
          description: `Creating 5 ad variations (5 credits).`
        });

        console.log(`🧠 Sending prompt for ${platform}`, JSON.stringify(promptData, null, 2));

        try {
          const ads = await generateCampaignAds(promptData);
          
          // Need to convert the returned GeneratedAdContent to proper ad arrays
          if (ads) {
            // Extract correct platform data and convert to array
            if (platform === 'google' && ads.google_ads) {
              results[platform] = convertGoogleAdsFormat(ads.google_ads);
              hasAnySuccessfulPlatform = true;
            } else if ((platform === 'meta' || platform === 'instagram') && (ads.meta_ads || ads.instagram_ads)) {
              results[platform] = convertMetaAdsFormat(ads.meta_ads || ads.instagram_ads || []);
              hasAnySuccessfulPlatform = true;
            } else if (platform === 'linkedin' && ads.linkedin_ads) {
              results[platform] = convertMetaAdsFormat(ads.linkedin_ads);
              hasAnySuccessfulPlatform = true;
            } else if (platform === 'microsoft' && ads.microsoft_ads) {
              results[platform] = convertGoogleAdsFormat(ads.microsoft_ads);
              hasAnySuccessfulPlatform = true;
            } else {
              console.warn(`No ${platform} ads data received`);
              // Create fallback ads if generation returns empty
              results[platform] = generateFallbackAds(platform, promptData);
              hasAnySuccessfulPlatform = true;
              
              toast({
                variant: "destructive",
                title: `Using fallback ads for ${platform}`,
                description: "We've created placeholder ads. You can edit them in the next step."
              });
            }
          } else {
            console.warn(`No ${platform} ads data received, using fallbacks`);
            // Create fallback ads if generation returns empty
            results[platform] = generateFallbackAds(platform, promptData);
            hasAnySuccessfulPlatform = true;
            
            toast({
              variant: "destructive",
              title: `Using fallback ads for ${platform}`,
              description: "We've created placeholder ads. You can edit them in the next step."
            });
          }
        } catch (error) {
          console.error(`❌ Failed to generate ads for ${platform}:`, error);
          // Create fallback ads on error
          results[platform] = generateFallbackAds(platform, promptData);
          hasAnySuccessfulPlatform = true;
          
          toast({
            variant: "destructive",
            title: `Using fallback ads for ${platform}`,
            description: "We've created placeholder ads. You can edit them in the next step."
          });
        }
      }

      if (hasAnySuccessfulPlatform) {
        console.log("✅ Final generated ads: ", results);
        onAdsGenerated(results);
        toast({
          title: "Ad Variations Generated!",
          description: `Created ads for: ${Object.keys(results).join(", ")}`
        });
        
        // Automatically move to the next step after successful generation
        if (onNext) {
          setTimeout(() => {
            onNext();
          }, 1000); // Short delay to allow user to see the success message
        }
      } else {
        setError("Failed to generate ads for any platform. Please try again.");
        toast({
          variant: "destructive",
          title: "Ad Generation Failed",
          description: "Could not generate ads. Please try again or check your inputs."
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to generate ads:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Ad generation failed",
        description: error instanceof Error ? error.message : "Something went wrong. Try again."
      });
    }
  };

  // Converts API response format to match our GoogleAd interface
  const convertGoogleAdsFormat = (ads: any[]): GoogleAd[] => {
    return ads.map(ad => ({
      headline1: ad.headline_1 || '',
      headline2: ad.headline_2 || '',
      headline3: ad.headline_3 || 'Learn More',
      description1: ad.description_1 || '',
      description2: ad.description_2 || '',
      displayPath: ad.display_url || '',
      path1: 'services',
      path2: 'info',
      siteLinks: []
    }));
  };

  // Converts API response format to match our MetaAd interface
  const convertMetaAdsFormat = (ads: any[]): MetaAd[] => {
    return ads.map(ad => ({
      headline: ad.headline || ad.text?.split('\n')[0] || 'Discover More',
      primaryText: ad.text || ad.primaryText || '',
      description: ad.description || '',
      imagePrompt: ad.image_prompt || ad.imagePrompt || `Professional ad image`,
      format: 'feed'
    }));
  };

  // Generate fallback ads when API fails
  const generateFallbackAds = (platform: string, promptData: CampaignPromptData) => {
    const companyName = promptData.companyName || 'Your Company';
    const industry = promptData.industry || 'professional services';
    const targetAudience = promptData.targetAudience || 'potential customers';
    const objective = promptData.objective || 'awareness';
    
    if (platform === 'google' || platform === 'microsoft') {
      return Array(5).fill(null).map((_, i) => ({
        headline1: `${companyName} - ${industry}`,
        headline2: `Solutions for ${targetAudience}`,
        headline3: `${objective === 'conversion' ? 'Buy Now' : objective === 'consideration' ? 'Learn More' : 'Discover Today'}`,
        description1: `We provide top-quality ${industry} services designed for ${targetAudience}.`,
        description2: `${promptData.companyDescription?.substring(0, 80) || `Learn more about how we help ${targetAudience} succeed.`}`,
        displayPath: promptData.websiteUrl || 'example.com',
        path1: 'services',
        path2: 'info',
        siteLinks: []
      }));
    } else if (platform === 'meta' || platform === 'linkedin') {
      return Array(5).fill(null).map((_, i) => ({
        headline: `${companyName} - ${industry} Solutions`,
        primaryText: `${promptData.companyDescription?.substring(0, 100) || `Discover how our ${industry} solutions can transform your experience.`} Our team is ready to help ${targetAudience} achieve their goals.`,
        description: `Quality services tailored for ${targetAudience}. ${objective === 'conversion' ? 'Buy Now!' : objective === 'consideration' ? 'Learn More Today' : 'Discover How'}`,
        imagePrompt: `Professional ${industry} image for ${companyName}, showing people representing ${targetAudience}, in a modern setting with ${promptData.brandTone || 'professional'} atmosphere`,
        format: 'feed'
      }));
    }
    
    return [];
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

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md bg-blue-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Ad Generation Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Company: {campaignData.companyName || analysisResult?.companyName || campaignData.name}</p>
                  <p>Objective: {campaignData.objective || 'Not specified'}</p>
                  <p>Platforms:</p>
                  <ul className="list-disc ml-4 text-sm text-gray-700 dark:text-gray-300">
                    {platforms.map((platform) => (
                      <li key={platform}>
                        <strong>{platform}:</strong> Mind Trigger: {campaignData.mindTriggers?.[platform] || 'None'}
                      </li>
                    ))}
                  </ul>
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

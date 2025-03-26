
import React, { useState, useEffect } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import GoogleAdsTab from "./ad-preview/GoogleAdsTab";
import MetaAdsTab from "./ad-preview/MetaAdsTab";
import MicrosoftAdsTab from "./ad-preview/MicrosoftAdsTab";
import LinkedInAdsTab from "./ad-preview/LinkedInAdsTab";
import MentalTriggersSection from "./ad-preview/MentalTriggersSection";
import { useToast } from "@/hooks/use-toast";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: any[];
  linkedInAds: MetaAd[];
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateGoogleAds: () => Promise<void>;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateMicrosoftAds: () => Promise<void>;
  onGenerateLinkedInAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  onUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  onUpdateMicrosoftAd: (index: number, updatedAd: any) => void;
  onUpdateLinkedInAd: (index: number, updatedAd: MetaAd) => void;
  onNext: () => void;
  onBack: () => void;
  mindTriggers?: Record<string, string>;
}

const AdPreviewStep: React.FC<AdPreviewStepProps> = ({
  analysisResult,
  googleAds,
  metaAds,
  microsoftAds,
  linkedInAds,
  isGenerating,
  loadingImageIndex,
  onGenerateGoogleAds,
  onGenerateMetaAds,
  onGenerateMicrosoftAds,
  onGenerateLinkedInAds,
  onGenerateImage,
  onUpdateGoogleAd,
  onUpdateMetaAd,
  onUpdateMicrosoftAd,
  onUpdateLinkedInAd,
  onNext,
  onBack,
  mindTriggers = {},
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Auto-generate ads on component mount based on the selected platforms
  useEffect(() => {
    const generateAdsForPlatforms = async () => {
      const platformsWithAds: Record<string, boolean> = {
        google: googleAds.length > 0,
        meta: metaAds.length > 0,
        linkedin: linkedInAds.length > 0,
        microsoft: microsoftAds.length > 0
      };

      // Find the first platform in mindTriggers that doesn't have ads yet
      const platformToGenerate = Object.keys(mindTriggers).find(
        platform => mindTriggers[platform] && !platformsWithAds[platform]
      );

      if (platformToGenerate && !isGenerating) {
        setActiveTab(platformToGenerate);
        
        try {
          switch (platformToGenerate) {
            case 'google':
              await onGenerateGoogleAds();
              break;
            case 'meta':
              await onGenerateMetaAds();
              break;
            case 'linkedin':
              await onGenerateLinkedInAds();
              break;
            case 'microsoft':
              await onGenerateMicrosoftAds();
              break;
          }
        } catch (error) {
          console.error(`Error generating ads for ${platformToGenerate}:`, error);
          toast({
            title: "Ad Generation Failed",
            description: `There was a problem generating ${platformToGenerate} ads. Please try again.`,
            variant: "destructive",
          });
        }
      }
    };

    // Set active tab to first platform if not set
    if (!activeTab && Object.keys(mindTriggers).length > 0) {
      setActiveTab(Object.keys(mindTriggers)[0]);
    }

    generateAdsForPlatforms();
  }, [
    activeTab, 
    mindTriggers, 
    googleAds.length, 
    metaAds.length, 
    linkedInAds.length, 
    microsoftAds.length,
    isGenerating
  ]);

  const handleSelectTrigger = (trigger: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(trigger);
    
    toast({
      title: "Trigger copied to clipboard",
      description: "Paste it into any ad text field to use it",
    });
  };

  const hasAdsForCurrentPlatform = () => {
    if (!activeTab) return false;
    
    switch (activeTab) {
      case "google": return googleAds.length > 0;
      case "meta": return metaAds.length > 0;
      case "linkedin": return linkedInAds.length > 0;
      case "microsoft": return microsoftAds.length > 0;
      default: return false;
    }
  };

  const handleRegenerateAds = async () => {
    if (!activeTab || isGenerating) return;
    
    try {
      switch (activeTab) {
        case "google":
          await onGenerateGoogleAds();
          break;
        case "meta":
          await onGenerateMetaAds();
          break;
        case "linkedin":
          await onGenerateLinkedInAds();
          break;
        case "microsoft":
          await onGenerateMicrosoftAds();
          break;
      }
    } catch (error) {
      console.error(`Error regenerating ads for ${activeTab}:`, error);
      toast({
        title: "Ad Regeneration Failed",
        description: `There was a problem regenerating ${activeTab} ads. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getPlatformDisplay = (platformId: string) => {
    switch(platformId) {
      case "google": return "Google Ads";
      case "meta": return "Instagram Ads";
      case "linkedin": return "LinkedIn Ads";
      case "microsoft": return "Microsoft Ads";
      default: return platformId;
    }
  };

  // Get platforms that have mind triggers
  const platformsWithTriggers = Object.keys(mindTriggers).filter(
    platform => mindTriggers[platform]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Ad Previews</CardTitle>
            {activeTab && hasAdsForCurrentPlatform() && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRegenerateAds}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate
              </Button>
            )}
          </div>
          <CardDescription>
            Preview your AI-generated ads based on your website analysis and selected mind triggers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs value={activeTab || ""} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6 grid" style={{ gridTemplateColumns: `repeat(${platformsWithTriggers.length}, 1fr)` }}>
              {platformsWithTriggers.map(platform => (
                <TabsTrigger key={platform} value={platform}>
                  {getPlatformDisplay(platform)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="google" className="mt-4">
              <GoogleAdsTab
                googleAds={googleAds}
                isGenerating={isGenerating}
                onGenerateAds={onGenerateGoogleAds}
                onUpdateGoogleAd={(updatedAds) => {
                  googleAds.forEach((_, index) => {
                    if (updatedAds[index]) {
                      onUpdateGoogleAd(index, updatedAds[index]);
                    }
                  });
                }}
                analysisResult={analysisResult}
                mindTrigger={mindTriggers["google"]}
              />
            </TabsContent>

            <TabsContent value="meta" className="mt-4">
              <MetaAdsTab
                metaAds={metaAds}
                analysisResult={analysisResult}
                isGenerating={isGenerating}
                loadingImageIndex={loadingImageIndex}
                onGenerateAds={onGenerateMetaAds}
                onGenerateImage={onGenerateImage}
                onUpdateMetaAd={(updatedAds) => {
                  metaAds.forEach((_, index) => {
                    if (updatedAds[index]) {
                      onUpdateMetaAd(index, updatedAds[index]);
                    }
                  });
                }}
                mindTrigger={mindTriggers["meta"]}
              />
            </TabsContent>

            <TabsContent value="linkedin" className="mt-4">
              <LinkedInAdsTab
                linkedInAds={linkedInAds}
                analysisResult={analysisResult}
                isGenerating={isGenerating}
                loadingImageIndex={loadingImageIndex}
                onGenerateAds={onGenerateLinkedInAds}
                onGenerateImage={(ad, index) => onGenerateImage(ad, index)}
                onUpdateLinkedInAd={(updatedAds) => {
                  linkedInAds.forEach((_, index) => {
                    if (updatedAds[index]) {
                      onUpdateLinkedInAd(index, updatedAds[index]);
                    }
                  });
                }}
                mindTrigger={mindTriggers["linkedin"]}
              />
            </TabsContent>

            <TabsContent value="microsoft" className="mt-4">
              <MicrosoftAdsTab
                microsoftAds={microsoftAds}
                analysisResult={analysisResult}
                isGenerating={isGenerating}
                onGenerateAds={onGenerateMicrosoftAds}
                onUpdateMicrosoftAd={(updatedAds) => {
                  microsoftAds.forEach((_, index) => {
                    if (updatedAds[index]) {
                      onUpdateMicrosoftAd(index, updatedAds[index]);
                    }
                  });
                }}
                mindTrigger={mindTriggers["microsoft"]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <MentalTriggersSection onSelectTrigger={handleSelectTrigger} />

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={isGenerating}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default AdPreviewStep;

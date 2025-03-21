
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import GoogleAdsTab from "./ad-preview/GoogleAdsTab";
import MetaAdsTab from "./ad-preview/MetaAdsTab";
import LinkedInAdsTab from "./ad-preview/LinkedInAdsTab";
import MicrosoftAdsTab from "./ad-preview/MicrosoftAdsTab";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: any[];
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateGoogleAds: () => Promise<void>;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateMicrosoftAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  onUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  onUpdateMicrosoftAd: (index: number, updatedAd: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const AdPreviewStep: React.FC<AdPreviewStepProps> = ({
  analysisResult,
  googleAds,
  metaAds,
  microsoftAds,
  isGenerating,
  loadingImageIndex,
  onGenerateGoogleAds,
  onGenerateMetaAds,
  onGenerateMicrosoftAds,
  onGenerateImage,
  onUpdateGoogleAd,
  onUpdateMetaAd,
  onUpdateMicrosoftAd,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>("google");
  const [campaigns, setCampaigns] = useState<{ [key: string]: any }>({});

  // Get the selected platforms from localStorage or use default
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    // Load campaign data from localStorage to get selected platforms
    const storedCampaign = localStorage.getItem('campaignData');
    if (storedCampaign) {
      try {
        const campaignData = JSON.parse(storedCampaign);
        if (campaignData.platforms && campaignData.platforms.length > 0) {
          setSelectedPlatforms(campaignData.platforms);
          // Set active tab to the first selected platform
          setActiveTab(campaignData.platforms[0]);
        }
      } catch (error) {
        console.error('Error parsing campaign data from localStorage:', error);
      }
    }
  }, []);

  // Only show tabs for selected platforms
  const renderTabs = () => {
    return (
      <TabsList className="grid w-full grid-cols-4">
        {selectedPlatforms.includes('google') && (
          <TabsTrigger value="google">Google Ads</TabsTrigger>
        )}
        {selectedPlatforms.includes('meta') && (
          <TabsTrigger value="meta">Instagram (Meta)</TabsTrigger>
        )}
        {selectedPlatforms.includes('linkedin') && (
          <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
        )}
        {selectedPlatforms.includes('microsoft') && (
          <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
        )}
      </TabsList>
    );
  };

  // Adapter function to convert single ad update to array update for GoogleAdsTab
  const handleUpdateGoogleAds = (updatedAds: GoogleAd[]) => {
    // In this case, we're receiving the whole updated array from GoogleAdsTab
    updatedAds.forEach((ad, index) => {
      if (index < googleAds.length) {
        onUpdateGoogleAd(index, ad);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Preview & Customization</CardTitle>
        <CardDescription>
          Generate and customize your ad creatives for each platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {renderTabs()}

          {selectedPlatforms.includes('google') && (
            <TabsContent value="google" className="space-y-4">
              <GoogleAdsTab
                googleAds={googleAds}
                isGenerating={isGenerating}
                onGenerateAds={onGenerateGoogleAds}
                onUpdateGoogleAd={handleUpdateGoogleAds}
                analysisResult={analysisResult}
              />
            </TabsContent>
          )}

          {selectedPlatforms.includes('meta') && (
            <TabsContent value="meta" className="space-y-4">
              <MetaAdsTab
                metaAds={metaAds}
                isGenerating={isGenerating}
                loadingImageIndex={loadingImageIndex}
                onGenerateMetaAds={onGenerateMetaAds}
                onGenerateImage={onGenerateImage}
                onUpdateMetaAd={onUpdateMetaAd}
                analysisResult={analysisResult}
              />
            </TabsContent>
          )}

          {selectedPlatforms.includes('linkedin') && (
            <TabsContent value="linkedin" className="space-y-4">
              <LinkedInAdsTab
                linkedInAds={metaAds}
                isGenerating={isGenerating}
                loadingImageIndex={loadingImageIndex}
                onGenerateLinkedInAds={onGenerateMetaAds}
                onGenerateImage={onGenerateImage}
                onUpdateLinkedInAd={onUpdateMetaAd}
                analysisResult={analysisResult}
              />
            </TabsContent>
          )}

          {selectedPlatforms.includes('microsoft') && (
            <TabsContent value="microsoft" className="space-y-4">
              <MicrosoftAdsTab
                microsoftAds={microsoftAds}
                isGenerating={isGenerating}
                onGenerateMicrosoftAds={onGenerateMicrosoftAds}
                onUpdateMicrosoftAd={onUpdateMicrosoftAd}
                analysisResult={analysisResult}
              />
            </TabsContent>
          )}
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

export default AdPreviewStep;

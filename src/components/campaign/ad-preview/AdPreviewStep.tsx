
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GoogleAdsTab from "./GoogleAdsTab";
import MetaAdsTab from "./MetaAdsTab";
import LinkedInAdsTab from "./LinkedInAdsTab";
import MicrosoftAdsTab from "./MicrosoftAdsTab";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import MentalTriggersSection from "./MentalTriggersSection";
import { useCampaign } from "@/contexts/CampaignContext";
import { useToast } from "@/hooks/use-toast";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult | null;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  linkedInAds: any[];
  microsoftAds: any[];
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
  onUpdateLinkedInAd: (index: number, updatedAd: any) => void;
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
  mindTriggers = {}
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("google");
  const { campaignData, setCampaignData } = useCampaign();
  const { toast } = useToast();

  const handleSelectTrigger = (trigger: string, platform: string) => {
    // Only update the state, do not call onNext or any navigation
    const updatedMindTriggers = {
      ...campaignData.mindTriggers || {},
      [platform]: trigger
    };
    
    setCampaignData((prev) => ({
      ...prev,
      mindTriggers: updatedMindTriggers
    }));
    
    toast({
      title: "Mind Trigger Updated",
      description: `Mind trigger for ${platform} ads has been updated.`,
    });
  };

  if (!analysisResult) {
    return <div>No website analysis found. Please go back and analyze a website first.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Creation & Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="google">Google Ads</TabsTrigger>
                <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
                <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
              </TabsList>

              <TabsContent value="google">
                <GoogleAdsTab
                  googleAds={googleAds}
                  analysisResult={analysisResult}
                  isGenerating={isGenerating}
                  onGenerateAds={onGenerateGoogleAds}
                  onUpdateGoogleAd={onUpdateGoogleAd}
                  mindTrigger={mindTriggers?.google}
                />
              </TabsContent>

              <TabsContent value="meta">
                <MetaAdsTab
                  metaAds={metaAds}
                  analysisResult={analysisResult}
                  isGenerating={isGenerating}
                  loadingImageIndex={loadingImageIndex}
                  onGenerateAds={onGenerateMetaAds}
                  onGenerateImage={onGenerateImage}
                  onUpdateMetaAd={onUpdateMetaAd}
                  mindTrigger={mindTriggers?.meta}
                />
              </TabsContent>

              <TabsContent value="linkedin">
                <LinkedInAdsTab
                  linkedInAds={linkedInAds}
                  analysisResult={analysisResult}
                  isGenerating={isGenerating}
                  loadingImageIndex={loadingImageIndex}
                  onGenerateAds={onGenerateLinkedInAds}
                  onGenerateImage={(ad, index) => onGenerateImage(ad, index)}
                  onUpdateLinkedInAd={onUpdateLinkedInAd}
                  mindTrigger={mindTriggers?.linkedin}
                />
              </TabsContent>

              <TabsContent value="microsoft">
                <MicrosoftAdsTab
                  microsoftAds={microsoftAds}
                  analysisResult={analysisResult}
                  isGenerating={isGenerating}
                  onGenerateAds={onGenerateMicrosoftAds}
                  onUpdateMicrosoftAd={onUpdateMicrosoftAd}
                  mindTrigger={mindTriggers?.microsoft}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <MentalTriggersSection 
              onSelectTrigger={handleSelectTrigger} 
              activePlatform={selectedPlatform}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
          >
            Back
          </Button>
          <Button onClick={onNext}>
            Next Step 
            <MoveRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreviewStep;

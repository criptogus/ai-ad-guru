
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdsTab from "./ad-preview/GoogleAdsTab";
import MetaAdsTab from "./ad-preview/MetaAdsTab";
import MicrosoftAdsTab from "./ad-preview/MicrosoftAdsTab";
import LinkedInAdsTab from "./ad-preview/LinkedInAdsTab";
import MentalTriggersSection from "./ad-preview/MentalTriggersSection";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}) => {
  const [activeTab, setActiveTab] = useState("google");
  const { toast } = useToast();

  const handleSelectTrigger = (trigger: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(trigger);
    
    toast({
      title: "Trigger copied to clipboard",
      description: "Paste it into any ad text field to use it",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6 grid grid-cols-4">
              <TabsTrigger value="google">Google Ads</TabsTrigger>
              <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
              <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
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
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <MentalTriggersSection onSelectTrigger={handleSelectTrigger} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdPreviewStep;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import GoogleAdsTab from "./ad-preview/GoogleAdsTab";
import MetaAdsTab from "./ad-preview/MetaAdsTab";
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
  const [currentTab, setCurrentTab] = useState<string>("google");
  
  // Check which platforms have ads or need to be generated
  const hasGoogleAds = googleAds.length > 0;
  const hasMetaAds = metaAds.length > 0;
  const hasMicrosoftAds = microsoftAds.length > 0;
  
  const hasAnyAds = hasGoogleAds || hasMetaAds || hasMicrosoftAds;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ad Previews</CardTitle>
        <CardDescription>
          Generate and preview your ads across different platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google">
            <GoogleAdsTab
              googleAds={googleAds}
              isGenerating={isGenerating}
              onGenerateAds={onGenerateGoogleAds}
              onUpdateGoogleAd={(updatedAds) => {
                updatedAds.forEach((ad, index) => {
                  onUpdateGoogleAd(index, ad);
                });
              }}
              analysisResult={analysisResult}
            />
          </TabsContent>
          
          <TabsContent value="meta">
            <MetaAdsTab
              metaAds={metaAds}
              isGenerating={isGenerating}
              loadingImageIndex={loadingImageIndex}
              onGenerateAds={onGenerateMetaAds}
              onGenerateImage={onGenerateImage}
              onUpdateMetaAd={(updatedAds) => {
                updatedAds.forEach((ad, index) => {
                  onUpdateMetaAd(index, ad);
                });
              }}
              analysisResult={analysisResult}
            />
          </TabsContent>
          
          <TabsContent value="microsoft">
            <MicrosoftAdsTab
              microsoftAds={microsoftAds}
              isGenerating={isGenerating}
              onGenerateAds={onGenerateMicrosoftAds}
              onUpdateMicrosoftAd={(updatedAds) => {
                updatedAds.forEach((ad, index) => {
                  onUpdateMicrosoftAd(index, ad);
                });
              }}
              analysisResult={analysisResult}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!hasAnyAds}>
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreviewStep;

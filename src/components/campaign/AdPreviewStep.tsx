
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import GoogleAdsTab from "./ad-preview/google/GoogleAdsTab";
import MetaAdsTab from "./ad-preview/meta/MetaAdsTab";
import LinkedInAdsTab from "./ad-preview/linkedin/LinkedInAdsTab";
import MicrosoftAdsTab from "./ad-preview/microsoft/MicrosoftAdsTab";
import { getMindTrigger } from "@/hooks/campaignActions/getMindTrigger";

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
  mindTriggers = {}
}) => {
  const [activeTab, setActiveTab] = useState<string>("google");
  
  // Get mindTrigger for the current platform
  const getCurrentMindTrigger = (platform: string): string => {
    return getMindTrigger({ mindTriggers }, platform);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Preview & Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google" className="space-y-4">
            <GoogleAdsTab
              googleAds={googleAds}
              isGenerating={isGenerating}
              onGenerateAds={onGenerateGoogleAds}
              onUpdateGoogleAd={onUpdateGoogleAd}
              mindTrigger={getCurrentMindTrigger("google")}
            />
          </TabsContent>
          
          <TabsContent value="meta" className="space-y-4">
            <MetaAdsTab
              metaAds={metaAds}
              analysisResult={analysisResult}
              isGenerating={isGenerating}
              loadingImageIndex={loadingImageIndex}
              onGenerateAds={onGenerateMetaAds}
              onGenerateImage={onGenerateImage}
              onUpdateMetaAd={onUpdateMetaAd}
              mindTrigger={getCurrentMindTrigger("meta")}
            />
          </TabsContent>
          
          <TabsContent value="linkedin" className="space-y-4">
            <LinkedInAdsTab
              linkedInAds={linkedInAds}
              analysisResult={analysisResult}
              isGenerating={isGenerating}
              loadingImageIndex={loadingImageIndex}
              onGenerateAds={onGenerateLinkedInAds}
              onGenerateImage={onGenerateImage}
              onUpdateLinkedInAd={onUpdateLinkedInAd}
              mindTrigger={getCurrentMindTrigger("linkedin")}
            />
          </TabsContent>
          
          <TabsContent value="microsoft" className="space-y-4">
            <MicrosoftAdsTab
              microsoftAds={microsoftAds}
              isGenerating={isGenerating}
              onGenerateAds={onGenerateMicrosoftAds}
              onUpdateMicrosoftAd={onUpdateMicrosoftAd}
              mindTrigger={getCurrentMindTrigger("microsoft")}
            />
          </TabsContent>
        </Tabs>
        
        <div className="pt-6 mt-6 border-t flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={
              googleAds.length === 0 && 
              metaAds.length === 0 && 
              linkedInAds.length === 0 && 
              microsoftAds.length === 0
            }
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreviewStep;

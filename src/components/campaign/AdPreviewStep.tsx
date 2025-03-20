
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdsTab from "./ad-preview/GoogleAdsTab";
import LinkedInAdsTab from "./ad-preview/LinkedInAdsTab";
import MicrosoftAdsTab from "./ad-preview/MicrosoftAdsTab";
import MetaAdsTab from "./ad-preview/MetaAdsTab";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: GoogleAd[]; // Microsoft ads use same format as Google Ads
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateGoogleAds: () => Promise<void>;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateMicrosoftAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateGoogleAd?: (index: number, updatedAd: GoogleAd) => void;
  onUpdateMetaAd?: (index: number, updatedAd: MetaAd) => void;
  onUpdateMicrosoftAd?: (index: number, updatedAd: GoogleAd) => void;
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
  onBack
}) => {
  const [activeTab, setActiveTab] = useState("google");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Previews</CardTitle>
        <CardDescription>
          Preview, edit, and select AI-generated ads for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs 
          defaultValue="google" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="instagram">Instagram Ads</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
          </TabsList>
          
          {/* Google Ads Content */}
          <TabsContent value="google">
            <GoogleAdsTab 
              googleAds={googleAds}
              analysisResult={analysisResult}
              isGenerating={isGenerating}
              onGenerateGoogleAds={onGenerateGoogleAds}
              onUpdateAd={onUpdateGoogleAd}
            />
          </TabsContent>
          
          {/* Instagram Ads Content */}
          <TabsContent value="instagram">
            <MetaAdsTab 
              metaAds={metaAds}
              analysisResult={analysisResult}
              isGenerating={isGenerating}
              loadingImageIndex={loadingImageIndex}
              onGenerateMetaAds={onGenerateMetaAds}
              onGenerateImage={onGenerateImage}
              onUpdateAd={onUpdateMetaAd}
            />
          </TabsContent>
          
          {/* LinkedIn Ads Content */}
          <TabsContent value="linkedin">
            <LinkedInAdsTab 
              linkedInAds={metaAds}
              analysisResult={analysisResult}
              isGenerating={isGenerating}
              loadingImageIndex={loadingImageIndex}
              onGenerateLinkedInAds={onGenerateMetaAds}
              onGenerateImage={onGenerateImage}
              onUpdateAd={onUpdateMetaAd}
            />
          </TabsContent>
          
          {/* Microsoft Ads Content */}
          <TabsContent value="microsoft">
            <MicrosoftAdsTab 
              microsoftAds={microsoftAds}
              analysisResult={analysisResult}
              isGenerating={isGenerating}
              onGenerateMicrosoftAds={onGenerateMicrosoftAds}
              onUpdateAd={onUpdateMicrosoftAd}
            />
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={
              (activeTab === "google" && googleAds.length === 0) || 
              (activeTab === "instagram" && metaAds.length === 0) ||
              (activeTab === "linkedin" && metaAds.length === 0) ||
              (activeTab === "microsoft" && microsoftAds.length === 0)
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

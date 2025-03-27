
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { getMindTrigger } from "@/hooks/campaignActions/getMindTrigger";

// Import existing tab components
import GoogleAdsTab from "@/components/campaign/ad-preview/GoogleAdsTab";
import MetaAdsTab from "@/components/campaign/ad-preview/MetaAdsTab";
import LinkedInAdsTab from "@/components/campaign/ad-preview/LinkedInAdsTab";
import MicrosoftAdsTab from "@/components/campaign/ad-preview/MicrosoftAdsTab";

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
    <Card className="shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Ad Preview & Customization</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-background border-b rounded-none p-0 h-auto">
            <TabsTrigger 
              value="google" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Google Ads
            </TabsTrigger>
            <TabsTrigger 
              value="meta" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Instagram Ads
            </TabsTrigger>
            <TabsTrigger 
              value="linkedin" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              LinkedIn Ads
            </TabsTrigger>
            <TabsTrigger 
              value="microsoft" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Microsoft Ads
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="google" className="mt-0">
              <GoogleAdsTab
                googleAds={googleAds}
                isGenerating={isGenerating}
                onGenerateAds={onGenerateGoogleAds}
                onUpdateGoogleAd={onUpdateGoogleAd}
                analysisResult={analysisResult}
                mindTrigger={getCurrentMindTrigger("google")}
              />
            </TabsContent>
            
            <TabsContent value="meta" className="mt-0">
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
            
            <TabsContent value="linkedin" className="mt-0">
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
            
            <TabsContent value="microsoft" className="mt-0">
              <MicrosoftAdsTab
                microsoftAds={microsoftAds}
                analysisResult={analysisResult}
                isGenerating={isGenerating}
                onGenerateAds={onGenerateMicrosoftAds}
                onUpdateMicrosoftAd={onUpdateMicrosoftAd}
                mindTrigger={getCurrentMindTrigger("microsoft")}
              />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex justify-between p-6 border-t">
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

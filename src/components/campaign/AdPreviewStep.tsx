
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdsTab from "./ad-preview/GoogleAdsTab";
import MetaAdsTab from "./ad-preview/MetaAdsTab";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateGoogleAds: () => Promise<void>;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateGoogleAd?: (index: number, updatedAd: GoogleAd) => void;
  onUpdateMetaAd?: (index: number, updatedAd: MetaAd) => void;
  onNext: () => void;
  onBack: () => void;
}

const AdPreviewStep: React.FC<AdPreviewStepProps> = ({
  analysisResult,
  googleAds,
  metaAds,
  isGenerating,
  loadingImageIndex,
  onGenerateGoogleAds,
  onGenerateMetaAds,
  onGenerateImage,
  onUpdateGoogleAd,
  onUpdateMetaAd,
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Meta/Instagram Ads</TabsTrigger>
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
          
          {/* Meta/Instagram Ads Content */}
          <TabsContent value="meta">
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
              (activeTab === "meta" && metaAds.length === 0)
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

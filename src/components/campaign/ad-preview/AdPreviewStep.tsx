
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GoogleAdsTab from "./GoogleAdsTab";
import MetaAdsTab from "./MetaAdsTab";
import LinkedInAdsTab from "./linkedin/LinkedInAdsTab";
import MicrosoftAdsTab from "./MicrosoftAdsTab";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import { useCampaign } from "@/contexts/CampaignContext";
import { useForm, FormProvider } from "react-hook-form";

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
  const { campaignData } = useCampaign();
  
  // Initialize the form with proper default values for all ad types
  const methods = useForm({
    defaultValues: {
      googleAds: googleAds || [],
      metaAds: metaAds || [],
      linkedInAds: linkedInAds || [],
      microsoftAds: microsoftAds || [],
      platform: selectedPlatform,
      // Add additional fields that might be used in nested components
      ad: null,
      companyInfo: analysisResult || undefined,
      companyName: analysisResult?.companyName || "",
      primaryText: "",
      headline: "",
      description: "",
      imagePrompt: ""
    }
  });

  // Update form values when ads change
  useEffect(() => {
    methods.setValue("googleAds", googleAds);
    methods.setValue("metaAds", metaAds);
    methods.setValue("linkedInAds", linkedInAds);
    methods.setValue("microsoftAds", microsoftAds);
  }, [googleAds, metaAds, linkedInAds, microsoftAds, methods]);

  // Update form when selected platform changes
  useEffect(() => {
    methods.setValue("platform", selectedPlatform);
  }, [selectedPlatform, methods]);

  if (!analysisResult) {
    return <div>No website analysis found. Please go back and analyze a website first.</div>;
  }

  return (
    <FormProvider {...methods}>
      <Card className="shadow-md border border-border">
        <CardHeader>
          <CardTitle>Ad Creation & Preview</CardTitle>
        </CardHeader>
        <CardContent>
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
                mindTrigger={mindTriggers['google']}
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
                mindTrigger={mindTriggers['meta']}
              />
            </TabsContent>

            <TabsContent value="linkedin">
              <LinkedInAdsTab
                linkedInAds={linkedInAds}
                analysisResult={analysisResult}
                isGenerating={isGenerating}
                loadingImageIndex={loadingImageIndex}
                onGenerateAds={onGenerateLinkedInAds}
                onGenerateImage={onGenerateImage}
                onUpdateLinkedInAd={onUpdateLinkedInAd}
                mindTrigger={mindTriggers['linkedin']}
              />
            </TabsContent>

            <TabsContent value="microsoft">
              <MicrosoftAdsTab
                microsoftAds={microsoftAds}
                analysisResult={analysisResult}
                isGenerating={isGenerating}
                onGenerateAds={onGenerateMicrosoftAds}
                onUpdateMicrosoftAd={onUpdateMicrosoftAd}
                mindTrigger={mindTriggers['microsoft']}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <Button variant="outline" onClick={onBack} className="flex items-center">
              Back
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Step 6 of 7
            </span>
            
            <Button 
              onClick={onNext} 
              className="flex items-center gap-2"
              disabled={
                (googleAds.length === 0 && metaAds.length === 0 && 
                linkedInAds.length === 0 && microsoftAds.length === 0)
              }
            >
              Next Step
              <MoveRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default AdPreviewStep;

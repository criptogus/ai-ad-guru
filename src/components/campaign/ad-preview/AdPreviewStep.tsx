
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GoogleAdsTab from "./GoogleAdsTab";
import MetaAdsTab from "./MetaAdsTab";
import LinkedInAdsTab from "./linkedin/LinkedInAdsTab";
import MicrosoftAdsTab from "./MicrosoftAdsTab";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";
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
  const { campaignData } = useCampaign();
  const selectedPlatforms = campaignData?.platforms || [];
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  
  // Create a form with properly initialized fields
  const methods = useForm({
    defaultValues: {
      googleAds: googleAds,
      metaAds: metaAds,
      linkedInAds: linkedInAds,
      microsoftAds: microsoftAds,
      platform: selectedPlatform,
      
      // Add explicit fields used by child components to avoid undefined errors
      headline: "",
      primaryText: "",
      description: "",
      imagePrompt: "",
      callToAction: "",
      displayUrl: "",
      finalUrl: "",
      
      // Company info fields
      companyName: analysisResult?.companyName || "",
      // Using businessDescription as it appears in WebsiteAnalysisResult interface
      businessDescription: analysisResult?.businessDescription || "",
      industry: "",
      adTheme: "",
      imageFormat: "square",
      
      // Generic ad fields that might be used by child components
      ad: {
        headline: "",
        primaryText: "",
        description: "",
        imagePrompt: "",
        imageUrl: ""
      }
    }
  });

  // Set the first selected platform as the default tab
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatform) {
      setSelectedPlatform(selectedPlatforms[0]);
      methods.setValue("platform", selectedPlatforms[0]);
    }
  }, [selectedPlatforms]);
  
  // Update form values when ads change
  useEffect(() => {
    methods.setValue("googleAds", googleAds);
    methods.setValue("metaAds", metaAds);
    methods.setValue("linkedInAds", linkedInAds);
    methods.setValue("microsoftAds", microsoftAds);
  }, [googleAds, metaAds, linkedInAds, microsoftAds]);

  // Update form when selected platform changes
  useEffect(() => {
    methods.setValue("platform", selectedPlatform);
  }, [selectedPlatform]);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPlatform]);
  
  const handleNextClick = () => {
    onNext();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!analysisResult) {
    return <div>No website analysis found. Please go back and analyze a website first.</div>;
  }

  // Check if there are any ads for the selected platforms
  const hasAdsForPlatform = (platform: string) => {
    switch (platform) {
      case 'google':
        return googleAds.length > 0;
      case 'meta':
        return metaAds.length > 0;
      case 'linkedin':
        return linkedInAds.length > 0;
      case 'microsoft':
        return microsoftAds.length > 0;
      default:
        return false;
    }
  };
  
  const hasAnyAds = selectedPlatforms.some(platform => hasAdsForPlatform(platform));

  return (
    <FormProvider {...methods}>
      <Card className="shadow-md border border-border">
        <CardHeader>
          <CardTitle>Ad Creation & Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPlatform} onValueChange={(value) => {
            setSelectedPlatform(value);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} className="w-full">
            <TabsList className="w-full mb-4">
              {selectedPlatforms.includes("google") && (
                <TabsTrigger value="google">Google Ads</TabsTrigger>
              )}
              {selectedPlatforms.includes("meta") && (
                <TabsTrigger value="meta">Instagram Ads</TabsTrigger>
              )}
              {selectedPlatforms.includes("linkedin") && (
                <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
              )}
              {selectedPlatforms.includes("microsoft") && (
                <TabsTrigger value="microsoft">Microsoft Ads</TabsTrigger>
              )}
            </TabsList>

            {selectedPlatforms.includes("google") && (
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
            )}

            {selectedPlatforms.includes("meta") && (
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
            )}

            {selectedPlatforms.includes("linkedin") && (
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
            )}

            {selectedPlatforms.includes("microsoft") && (
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
            )}
          </Tabs>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <Button variant="outline" onClick={onBack} className="flex items-center">
              Back
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Step 6 of 7
            </span>
            
            <Button 
              onClick={handleNextClick} 
              className="flex items-center gap-2"
              disabled={!hasAnyAds}
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

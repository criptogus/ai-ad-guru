
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
  linkedInAds: MetaAd[];
  microsoftAds: GoogleAd[];
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateGoogleAds: () => Promise<void>;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateMicrosoftAds: () => Promise<void>;
  onGenerateLinkedInAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  onUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  onUpdateMicrosoftAd: (index: number, updatedAd: GoogleAd) => void;
  onUpdateLinkedInAd: (index: number, updatedAd: MetaAd) => void;
  onNext: () => void;
  onBack: () => void;
  mindTriggers?: Record<string, string>;
}

const AdPreviewStep: React.FC<AdPreviewStepProps> = ({
  analysisResult,
  googleAds,
  metaAds,
  linkedInAds,
  microsoftAds,
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
  
  // Ensure arrays are initialized properly for form registration
  const safeGoogleAds = Array.isArray(googleAds) ? googleAds : [];
  const safeMetaAds = Array.isArray(metaAds) ? metaAds : [];
  const safeLinkedInAds = Array.isArray(linkedInAds) ? linkedInAds : [];
  const safeMicrosoftAds = Array.isArray(microsoftAds) ? microsoftAds : [];
  
  // Initialize form with comprehensive default values for ALL possible fields
  const methods = useForm({
    defaultValues: {
      // Platform & campaign fields
      platform: "",
      campaignName: campaignData?.campaignName || "",
      targetUrl: campaignData?.targetUrl || "",
      
      // Ad arrays - properly initialized
      googleAds: safeGoogleAds,
      metaAds: safeMetaAds,
      linkedInAds: safeLinkedInAds,
      microsoftAds: safeMicrosoftAds,
      
      // Common ad fields
      headline: "",
      primaryText: "",
      description: "",
      imagePrompt: "",
      callToAction: "", 
      displayUrl: "",
      finalUrl: "",
      
      // Company & audience info
      companyName: analysisResult?.companyName || "",
      businessDescription: analysisResult?.businessDescription || "",
      targetAudience: analysisResult?.targetAudience || "",
      
      // Additional fields
      industry: "",
      adTheme: "",
      imageFormat: "square",
      
      // Ensure these ad-specific fields are available to all components
      headlines: ["", "", ""],
      descriptions: ["", ""],
      path: ""
    }
  });

  // Set the selected platform when it changes or on initial load
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatform) {
      const firstPlatform = selectedPlatforms[0];
      setSelectedPlatform(firstPlatform);
      methods.setValue("platform", firstPlatform);
    }
  }, [selectedPlatforms, selectedPlatform, methods]);
  
  // Update form values when ads change
  useEffect(() => {
    if (safeGoogleAds.length > 0) {
      methods.setValue("googleAds", safeGoogleAds);
    }
    if (safeMetaAds.length > 0) {
      methods.setValue("metaAds", safeMetaAds);
    }
    if (safeLinkedInAds.length > 0) {
      methods.setValue("linkedInAds", safeLinkedInAds);
    }
    if (safeMicrosoftAds.length > 0) {
      methods.setValue("microsoftAds", safeMicrosoftAds);
    }
  }, [googleAds, metaAds, linkedInAds, microsoftAds, methods]);

  // Scroll to top when platform changes
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
        return safeGoogleAds.length > 0;
      case 'meta':
        return safeMetaAds.length > 0;
      case 'linkedin':
        return safeLinkedInAds.length > 0;
      case 'microsoft':
        return safeMicrosoftAds.length > 0;
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
            methods.setValue("platform", value);
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

            <div className="p-6">
              {selectedPlatforms.includes("google") && (
                <TabsContent value="google">
                  <GoogleAdsTab
                    googleAds={safeGoogleAds}
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
                    metaAds={safeMetaAds}
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
                    linkedInAds={safeLinkedInAds}
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
                    microsoftAds={safeMicrosoftAds}
                    analysisResult={analysisResult}
                    isGenerating={isGenerating}
                    onGenerateAds={onGenerateMicrosoftAds}
                    onUpdateMicrosoftAd={onUpdateMicrosoftAd}
                    mindTrigger={mindTriggers['microsoft']}
                  />
                </TabsContent>
              )}
            </div>
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

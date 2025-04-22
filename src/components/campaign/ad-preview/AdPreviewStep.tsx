
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";
import { getMindTrigger } from "@/hooks/campaignActions/getMindTrigger";
import { toast } from "sonner";

// Import existing tab components
import GoogleAdsTab from "@/components/campaign/ad-preview/GoogleAdsTab";
import MetaAdsTab from "@/components/campaign/ad-preview/MetaAdsTab";
import LinkedInAdsTab from "@/components/campaign/ad-preview/LinkedInAdsTab";
import MicrosoftAdsTab from "@/components/campaign/ad-preview/MicrosoftAdsTab";

interface AdPreviewStepProps {
  analysisResult: WebsiteAnalysisResult;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: GoogleAd[];
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
  
  // Auto-detect which platform to show based on available ads
  useEffect(() => {
    if (googleAds.length > 0) {
      setActiveTab("google");
    } else if (metaAds.length > 0) {
      setActiveTab("meta");
    } else if (linkedInAds.length > 0) {
      setActiveTab("linkedin");
    } else if (microsoftAds.length > 0) {
      setActiveTab("microsoft");
    }
    
    // Log what ads are available
    console.log("Available ads:", {
      google: googleAds.length,
      meta: metaAds.length,
      linkedin: linkedInAds.length,
      microsoft: microsoftAds.length
    });
  }, [googleAds, metaAds, linkedInAds, microsoftAds]);
  
  // Get mindTrigger for the current platform
  const getCurrentMindTrigger = (platform: string): string => {
    return getMindTrigger({ mindTriggers }, platform);
  };

  // Check if we have any ads at all
  const hasAnyAds = googleAds.length > 0 || metaAds.length > 0 || 
                    linkedInAds.length > 0 || microsoftAds.length > 0;
                    
  // Generate any missing ads if none are available
  useEffect(() => {
    if (!hasAnyAds && !isGenerating) {
      const generateMissingAds = async () => {
        // Determine which platform to generate based on user selection
        if (mindTriggers.google) {
          toast("Generating Google Ads", {
            description: "No ads found. Generating Google Ads automatically."
          });
          await onGenerateGoogleAds();
        } else if (mindTriggers.meta) {
          toast("Generating Instagram Ads", {
            description: "No ads found. Generating Instagram Ads automatically."
          });
          await onGenerateMetaAds();
        } else if (mindTriggers.linkedin) {
          toast("Generating LinkedIn Ads", {
            description: "No ads found. Generating LinkedIn Ads automatically."
          });
          await onGenerateLinkedInAds();
        } else if (mindTriggers.microsoft) {
          toast("Generating Microsoft Ads", {
            description: "No ads found. Generating Microsoft Ads automatically."
          });
          await onGenerateMicrosoftAds();
        } else {
          // Default to Google Ads if no specific platform is selected
          toast("Generating Google Ads", {
            description: "No ads found. Generating Google Ads automatically."
          });
          await onGenerateGoogleAds();
        }
      };
      
      generateMissingAds();
    }
  }, [hasAnyAds, isGenerating]);

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
              Google Ads {googleAds.length > 0 && `(${googleAds.length})`}
            </TabsTrigger>
            <TabsTrigger 
              value="meta" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Instagram Ads {metaAds.length > 0 && `(${metaAds.length})`}
            </TabsTrigger>
            <TabsTrigger 
              value="linkedin" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              LinkedIn Ads {linkedInAds.length > 0 && `(${linkedInAds.length})`}
            </TabsTrigger>
            <TabsTrigger 
              value="microsoft" 
              className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Microsoft Ads {microsoftAds.length > 0 && `(${microsoftAds.length})`}
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
          <Button onClick={onNext}>
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreviewStep;

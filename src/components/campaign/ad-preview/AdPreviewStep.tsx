
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

const PLATFORM_LABELS: Record<string, string> = {
  google: "Google Ads",
  meta: "Instagram Ads",
  linkedin: "LinkedIn Ads",
  microsoft: "Microsoft Ads"
};

const PLATFORM_COMPONENT: Record<
  string,
  React.FC<any>
> = {
  google: GoogleAdsTab,
  meta: MetaAdsTab,
  linkedin: LinkedInAdsTab,
  microsoft: MicrosoftAdsTab
};

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
  // --- DYNAMIC SELECTED PLATFORMS LOGIC ---
  const selectedPlatforms: string[] = Object.keys(mindTriggers).filter(
    (key) => !!mindTriggers[key] && ["google", "meta", "linkedin", "microsoft"].includes(key)
  );
  
  // Pick ads arrays and props by platform
  const platformAdProps: Record<string, any> = {
    google: {
      googleAds,
      isGenerating,
      onGenerateAds: onGenerateGoogleAds,
      onUpdateGoogleAd,
      analysisResult,
      mindTrigger: getMindTrigger({ mindTriggers }, "google"),
    },
    meta: {
      metaAds,
      analysisResult,
      isGenerating,
      loadingImageIndex,
      onGenerateAds: onGenerateMetaAds,
      onGenerateImage,
      onUpdateMetaAd,
      mindTrigger: getMindTrigger({ mindTriggers }, "meta"),
    },
    linkedin: {
      linkedInAds,
      analysisResult,
      isGenerating,
      loadingImageIndex,
      onGenerateAds: onGenerateLinkedInAds,
      onGenerateImage,
      onUpdateLinkedInAd,
      mindTrigger: getMindTrigger({ mindTriggers }, "linkedin"),
    },
    microsoft: {
      microsoftAds,
      analysisResult,
      isGenerating,
      onGenerateAds: onGenerateMicrosoftAds,
      onUpdateMicrosoftAd,
      mindTrigger: getMindTrigger({ mindTriggers }, "microsoft"),
    }
  };

  // Detect if we have any ads at all (for empty state)
  const hasAnyAds =
    (googleAds && googleAds.length > 0) ||
    (metaAds && metaAds.length > 0) ||
    (linkedInAds && linkedInAds.length > 0) ||
    (microsoftAds && microsoftAds.length > 0);

  // --- ACTIVE TAB DYNAMIC LOGIC ---
  const [activeTab, setActiveTab] = useState<string | undefined>(
    selectedPlatforms.length > 0 ? selectedPlatforms[0] : undefined
  );

  // Always set active tab to first available platform
  useEffect(() => {
    if (!activeTab || !selectedPlatforms.includes(activeTab)) {
      setActiveTab(selectedPlatforms.length > 0 ? selectedPlatforms[0] : undefined);
    }
  }, [selectedPlatforms.join(","), activeTab]);

  // --- Handle generating missing ads if none are present ---
  useEffect(() => {
    if (!hasAnyAds && !isGenerating) {
      const generateMissingAds = async () => {
        if (selectedPlatforms.includes("google")) {
          toast("Generating Google Ads", {
            description: "No ads found. Generating Google Ads automatically.",
          });
          await onGenerateGoogleAds();
        } else if (selectedPlatforms.includes("meta")) {
          toast("Generating Instagram Ads", {
            description: "No ads found. Generating Instagram Ads automatically.",
          });
          await onGenerateMetaAds();
        } else if (selectedPlatforms.includes("linkedin")) {
          toast("Generating LinkedIn Ads", {
            description: "No ads found. Generating LinkedIn Ads automatically.",
          });
          await onGenerateLinkedInAds();
        } else if (selectedPlatforms.includes("microsoft")) {
          toast("Generating Microsoft Ads", {
            description: "No ads found. Generating Microsoft Ads automatically.",
          });
          await onGenerateMicrosoftAds();
        }
      };
      generateMissingAds();
    }
  }, [hasAnyAds, isGenerating, selectedPlatforms.join(",")]);

  // Tooltips for platform explanation
  const tooltips: Record<string, string> = {
    google: "Google Search/Display text ads",
    meta: "Instagram Feed or Story ad",
    linkedin: "LinkedIn sponsored content",
    microsoft: "Microsoft (Bing) search/text ads"
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Ad Preview & Customization</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {selectedPlatforms.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid grid-cols-${selectedPlatforms.length} bg-background border-b rounded-none p-0 h-auto`}>
              {selectedPlatforms.map((platform) => (
                <TabsTrigger
                  key={platform}
                  value={platform}
                  className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                  title={tooltips[platform]}
                >
                  {PLATFORM_LABELS[platform]}
                  {platform === "google" && googleAds.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">{googleAds.length}</span>
                  )}
                  {platform === "meta" && metaAds.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">{metaAds.length}</span>
                  )}
                  {platform === "linkedin" && linkedInAds.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">{linkedInAds.length}</span>
                  )}
                  {platform === "microsoft" && microsoftAds.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">{microsoftAds.length}</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-6">
              {selectedPlatforms.map((platform) => {
                const TabComponent = PLATFORM_COMPONENT[platform];
                const tabProps = platformAdProps[platform];
                return (
                  <TabsContent key={platform} value={platform} className="mt-0">
                    <TabComponent {...tabProps} />
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center min-h-[200px] py-8">
            {!isGenerating ? (
              <div className="text-muted-foreground text-center text-base">
                No ad platforms selected yet.<br />
                You must select at least one platform in campaign setup.
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <div className="text-muted-foreground text-sm">Generating ads...</div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between p-6 border-t">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!hasAnyAds}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPreviewStep;

// ⚠️ This file is now 229+ lines and long. For maintainability and performance, consider splitting each platform's tab into a separate file or dynamic import when you have time!

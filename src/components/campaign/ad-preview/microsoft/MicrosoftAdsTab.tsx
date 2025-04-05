
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MicrosoftAd } from "@/hooks/adGeneration/types";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Loader2, Sparkles } from "lucide-react";
import MicrosoftAdsList from "./MicrosoftAdsList";
import EmptyAdsState from "../EmptyAdsState";
import { getDomain } from "@/lib/utils";

interface MicrosoftAdsTabProps {
  microsoftAds: MicrosoftAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateMicrosoftAd: (index: number, updatedAd: MicrosoftAd) => void;
  mindTrigger?: string;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({
  microsoftAds,
  analysisResult,
  isGenerating,
  onGenerateAds,
  onUpdateMicrosoftAd,
  mindTrigger
}) => {
  const handleGenerateClick = async () => {
    try {
      await onGenerateAds();
    } catch (error) {
      console.error("Error generating Microsoft Ads:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Microsoft Ads</h3>
          <p className="text-sm text-muted-foreground">
            Create text ads for Microsoft Advertising (Bing)
          </p>
        </div>

        <Button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          size="sm"
          className="flex items-center gap-2 self-end sm:self-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Ads
            </>
          )}
        </Button>
      </div>

      {mindTrigger && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <span className="font-semibold">Selected Mind Trigger:</span> {mindTrigger}
          </p>
        </div>
      )}

      {microsoftAds.length > 0 ? (
        <MicrosoftAdsList
          microsoftAds={microsoftAds}
          analysisResult={analysisResult}
          isGenerating={isGenerating}
          onGenerateAds={onGenerateAds}
          onUpdateMicrosoftAd={onUpdateMicrosoftAd}
        />
      ) : (
        <EmptyAdsState
          platform="microsoft"
          isGenerating={isGenerating}
          onGenerate={onGenerateAds}
        />
      )}
    </div>
  );
};

export default MicrosoftAdsTab;

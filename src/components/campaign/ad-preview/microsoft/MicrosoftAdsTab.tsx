import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { MicrosoftAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
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
  mindTrigger,
}) => {
  // Extract domain from website URL for display in ads
  const domain = getDomain(analysisResult?.websiteUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Microsoft Search Ads</h3>
          <p className="text-sm text-muted-foreground">
            Create text ads for Microsoft Search Network
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            onClick={onGenerateAds}
            disabled={isGenerating}
            size="sm"
            className="flex items-center gap-2"
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
      </div>

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

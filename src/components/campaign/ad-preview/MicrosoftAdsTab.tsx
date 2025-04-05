
import React from "react";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useCampaign } from "@/contexts/CampaignContext";
import { GoogleAd, MicrosoftAd } from "@/hooks/adGeneration/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MicrosoftAdCard } from "./microsoft";
import { normalizeGoogleAd, getDomain } from "@/lib/utils";

interface MicrosoftAdsTabProps {
  microsoftAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateMicrosoftAd: (index: number, updatedAd: GoogleAd) => void;
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
  const { campaignData } = useCampaign();
  const websiteUrl = campaignData?.targetUrl || analysisResult?.websiteUrl || "example.com";
  const domain = getDomain(websiteUrl);

  return (
    <div className="space-y-4">
      {mindTrigger && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Active Mind Trigger
          </AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300">
            {mindTrigger}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Microsoft Ads</h3>
        <div className="flex gap-2">
          <Button
            onClick={onGenerateAds}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Generate Ads
              </>
            )}
          </Button>
        </div>
      </div>

      {microsoftAds.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {microsoftAds.map((ad, index) => {
            // Always normalize to ensure consistent structure
            const normalizedAd = normalizeGoogleAd(ad);
            return (
              <MicrosoftAdCard
                key={index}
                ad={normalizedAd}
                domain={domain}
                index={index}
                onUpdate={(updatedAd) => onUpdateMicrosoftAd(index, normalizeGoogleAd(updatedAd))}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground mb-2">No Microsoft ads generated yet</p>
            <Button 
              onClick={onGenerateAds} 
              disabled={isGenerating}
              variant="outline"
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
                  <Plus className="h-4 w-4" />
                  Generate Microsoft Ads
                </>
              )}
            </Button>
            <div className="text-xs text-muted-foreground mt-2">
              This will use 5 credits
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MicrosoftAdsTab;

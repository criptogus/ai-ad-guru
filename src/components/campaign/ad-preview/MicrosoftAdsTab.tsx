
import React from "react";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { useCampaign } from "@/contexts/CampaignContext";
import { MicrosoftAdCard } from "./microsoft";

interface MicrosoftAdsTabProps {
  microsoftAds: any[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateMicrosoftAd: (index: number, updatedAd: any) => void;
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
  const domain = websiteUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

  return (
    <div className="space-y-4">
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
          {microsoftAds.map((ad, index) => (
            <MicrosoftAdCard
              key={index}
              ad={ad}
              domain={domain}
              index={index}
              onUpdate={(updatedAd) => onUpdateMicrosoftAd(index, updatedAd)}
            />
          ))}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MicrosoftAdsTab;

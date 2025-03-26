
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { getDomainFromUrl } from "@/lib/utils";
import MicrosoftAdCard from "./MicrosoftAdCard";

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
  const domain = getDomainFromUrl(analysisResult.websiteUrl || "example.com");

  return (
    <div className="space-y-6">
      {mindTrigger && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800 mb-4">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <span className="font-medium">Mind Trigger:</span> {mindTrigger}
          </p>
        </div>
      )}
      
      {microsoftAds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <h3 className="text-lg font-medium mb-2">No Microsoft Ads Generated Yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate Microsoft text ads based on your website analysis
              </p>
              <Button 
                onClick={onGenerateAds} 
                disabled={isGenerating}
                className="mx-auto"
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Microsoft Ads
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {microsoftAds.map((ad, index) => (
            <MicrosoftAdCard
              key={`microsoft-ad-${index}`}
              ad={ad}
              index={index}
              analysisResult={analysisResult}
              onUpdate={(updatedAd) => onUpdateMicrosoftAd(index, updatedAd)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MicrosoftAdsTab;

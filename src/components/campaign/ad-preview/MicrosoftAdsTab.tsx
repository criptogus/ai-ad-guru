
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import EmptyAdsState from "./EmptyAdsState";
import MicrosoftAdCard from "./MicrosoftAdCard";

interface MicrosoftAdsTabProps {
  microsoftAds: any[];
  isGenerating: boolean;
  onGenerateAds: () => Promise<any[] | null>;
  onUpdateMicrosoftAd: (updatedAds: any[]) => void;
  analysisResult: WebsiteAnalysisResult;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({
  microsoftAds,
  isGenerating,
  onGenerateAds,
  onUpdateMicrosoftAd,
  analysisResult,
}) => {
  const handleGenerateAds = async () => {
    await onGenerateAds();
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        {microsoftAds.length > 0 ? (
          microsoftAds.map((ad, index) => (
            <MicrosoftAdCard
              key={index}
              ad={ad}
              index={index}
              onUpdate={(updatedAd) => {
                const updatedAds = [...microsoftAds];
                updatedAds[index] = updatedAd;
                onUpdateMicrosoftAd(updatedAds);
              }}
              analysisResult={analysisResult}
            />
          ))
        ) : (
          <EmptyAdsState platform="Microsoft" />
        )}

        <Button
          variant="secondary"
          onClick={handleGenerateAds}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Microsoft Ads"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdsTab;

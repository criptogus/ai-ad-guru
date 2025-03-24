
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
  const handleUpdateAd = (index: number, updatedAd: any) => {
    const updatedAds = [...microsoftAds];
    updatedAds[index] = updatedAd;
    onUpdateMicrosoftAd(updatedAds);
  };

  if (!analysisResult) {
    return (
      <Card>
        <CardContent>
          Please analyze a website to generate ads.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {microsoftAds.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyAdsState platform="Microsoft" />
            <Button onClick={onGenerateAds} className="mt-4" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : "Generate Microsoft Ads"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {microsoftAds.map((ad, index) => (
            <MicrosoftAdCard
              key={index}
              ad={ad}
              index={index}
              analysisResult={analysisResult}
              onUpdate={(updatedAd) => handleUpdateAd(index, updatedAd)}
            />
          ))}
          <Button onClick={onGenerateAds} disabled={isGenerating} className="mt-4">
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate More Microsoft Ads"}
          </Button>
        </>
      )}
    </div>
  );
};

export default MicrosoftAdsTab;

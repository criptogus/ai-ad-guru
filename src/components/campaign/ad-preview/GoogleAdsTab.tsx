import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import GoogleAdCard from "./GoogleAdCard";
import EmptyAdsState from "./EmptyAdsState";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  isGenerating: boolean;
  onGenerateAds: () => Promise<GoogleAd[] | null>;
  onUpdateGoogleAd: (updatedAds: GoogleAd[]) => void;
  analysisResult: WebsiteAnalysisResult;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds,
  isGenerating,
  onGenerateAds,
  onUpdateGoogleAd,
  analysisResult,
}) => {
  const handleGenerateAds = async () => {
    await onGenerateAds();
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        {googleAds.length > 0 ? (
          googleAds.map((ad, index) => (
            <GoogleAdCard
              key={index}
              ad={ad}
              index={index}
              onAdUpdate={(updatedAd) => {
                const updatedAds = [...googleAds];
                updatedAds[index] = updatedAd;
                onUpdateGoogleAd(updatedAds);
              }}
              analysisResult={analysisResult}
            />
          ))
        ) : (
          <EmptyAdsState platform="Google Ads" />
        )}

        <Button
          onClick={handleGenerateAds}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Google Ads"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoogleAdsTab;

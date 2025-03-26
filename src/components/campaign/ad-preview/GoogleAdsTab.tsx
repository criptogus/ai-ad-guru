
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getDomainFromUrl } from "@/lib/utils";
import GoogleAdCard from "./google/GoogleAdCard";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  analysisResult: WebsiteAnalysisResult;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds,
  isGenerating,
  onGenerateAds,
  onUpdateGoogleAd,
  analysisResult
}) => {
  const domain = getDomainFromUrl(analysisResult.websiteUrl || "example.com");

  return (
    <div className="space-y-6">
      {googleAds.length === 0 ? (
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No Google Ads Generated Yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate Google text ads based on your website analysis
          </p>
          <Button 
            onClick={onGenerateAds} 
            disabled={isGenerating}
            className="mx-auto"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Google Ads
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {googleAds.map((ad, index) => (
            <GoogleAdCard
              key={`google-ad-${index}`}
              ad={ad}
              index={index}
              analysisResult={analysisResult}
              onUpdate={(updatedAd) => onUpdateGoogleAd(index, updatedAd)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleAdsTab;

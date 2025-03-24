
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import EmptyAdsState from "./EmptyAdsState";
import GoogleAdCard from "./GoogleAdCard";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
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
  const handleUpdateAd = (index: number, updatedAd: GoogleAd) => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    onUpdateGoogleAd(updatedAds);
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
      {googleAds.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyAdsState platform="Google" />
            <Button 
              onClick={onGenerateAds} 
              className="mt-4 group relative overflow-hidden" 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Generate Google Ads</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {googleAds.map((ad, index) => (
            <GoogleAdCard
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
            ) : "Generate More Google Ads"}
          </Button>
        </>
      )}
    </div>
  );
};

export default GoogleAdsTab;

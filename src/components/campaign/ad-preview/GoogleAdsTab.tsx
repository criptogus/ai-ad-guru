
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdCard from "./GoogleAdCard";
import EmptyAdState from "./EmptyAdState";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateGoogleAds: () => Promise<void>;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({ 
  googleAds, 
  analysisResult, 
  isGenerating, 
  onGenerateGoogleAds 
}) => {
  return (
    <div className="pt-4 space-y-4">
      {googleAds.length === 0 ? (
        <EmptyAdState 
          platform="google"
          onGenerate={onGenerateGoogleAds}
          isGenerating={isGenerating}
        />
      ) : (
        <div className="space-y-6">
          {googleAds.map((ad, index) => (
            <GoogleAdCard 
              key={index} 
              ad={ad} 
              index={index} 
              analysisResult={analysisResult} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleAdsTab;

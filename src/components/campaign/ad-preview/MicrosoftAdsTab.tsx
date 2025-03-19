
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MicrosoftAdCard from "./MicrosoftAdCard";
import EmptyAdState from "./EmptyAdState";

interface MicrosoftAdsTabProps {
  microsoftAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateMicrosoftAds: () => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: GoogleAd) => void;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({ 
  microsoftAds, 
  analysisResult, 
  isGenerating, 
  onGenerateMicrosoftAds,
  onUpdateAd
}) => {
  return (
    <div className="pt-4 space-y-4">
      {(!microsoftAds || microsoftAds.length === 0) ? (
        <EmptyAdState 
          platform="microsoft"
          onGenerate={onGenerateMicrosoftAds}
          isGenerating={isGenerating}
        />
      ) : (
        <div className="space-y-6">
          {microsoftAds.map((ad, index) => (
            <MicrosoftAdCard 
              key={index} 
              ad={ad} 
              index={index} 
              analysisResult={analysisResult}
              onUpdate={onUpdateAd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MicrosoftAdsTab;

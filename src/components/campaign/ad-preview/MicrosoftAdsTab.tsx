
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MicrosoftAdCard from "./MicrosoftAdCard";
import EmptyAdState from "./EmptyAdState";
import { PreviewLayout, DevicePreview, AdFormat } from "./GoogleAdsTab";

interface MicrosoftAdsTabProps {
  microsoftAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateMicrosoftAds: () => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: GoogleAd) => void;
  previewLayout?: PreviewLayout;
  devicePreview?: DevicePreview;
  adFormat?: AdFormat;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({ 
  microsoftAds, 
  analysisResult, 
  isGenerating, 
  onGenerateMicrosoftAds,
  onUpdateAd,
  previewLayout = "split-horizontal",
  devicePreview = "desktop",
  adFormat = "search"
}) => {
  const hasAds = microsoftAds && microsoftAds.length > 0;
  
  return (
    <div className="pt-4 space-y-4">
      {!hasAds ? (
        <EmptyAdState 
          platform="microsoft"
          onGenerate={onGenerateMicrosoftAds}
          isGenerating={isGenerating}
          buttonText="Generate Microsoft Ads"
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

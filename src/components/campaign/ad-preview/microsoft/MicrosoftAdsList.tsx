import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { MicrosoftAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MicrosoftAdCard from "./MicrosoftAdCard";
import { getDomain } from "@/lib/utils";

interface MicrosoftAdsListProps {
  microsoftAds: MicrosoftAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateMicrosoftAd: (index: number, updatedAd: MicrosoftAd) => void;
}

const MicrosoftAdsList: React.FC<MicrosoftAdsListProps> = ({
  microsoftAds,
  analysisResult,
  isGenerating,
  onGenerateAds,
  onUpdateMicrosoftAd,
}) => {
  // Extract domain from website URL for display in ads
  const domain = getDomain(analysisResult?.websiteUrl);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {microsoftAds.map((ad, index) => (
          <div 
            key={index} 
            className="border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onUpdateMicrosoftAd && onUpdateMicrosoftAd(index, ad)}
          >
            <h3 className="text-sm font-medium">Microsoft Ad #{index + 1}</h3>
            <MicrosoftAdCard ad={ad} domain={domain} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicrosoftAdsList;

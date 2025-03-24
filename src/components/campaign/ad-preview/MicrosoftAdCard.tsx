
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MicrosoftAdPreview from "./microsoft/MicrosoftAdPreview";
import MicrosoftAdCardHeader from "./microsoft/MicrosoftAdCardHeader";
import MicrosoftAdDetails from "./microsoft/MicrosoftAdDetails";

interface MicrosoftAdCardProps {
  ad: any;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  onUpdate?: (updatedAd: any) => void;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({ 
  ad, 
  index, 
  analysisResult,
  onUpdate
}) => {
  // Extract domain from website URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  return (
    <Card className="overflow-hidden">
      <MicrosoftAdCardHeader 
        index={index} 
        ad={ad} 
      />
      <CardContent className="p-4 grid gap-4 md:grid-cols-2">
        <div>
          <MicrosoftAdPreview 
            ad={ad} 
            domain={getDomain(analysisResult.websiteUrl)} 
          />
        </div>
        <div>
          <MicrosoftAdDetails 
            ad={ad}
            onUpdate={onUpdate} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdCard;

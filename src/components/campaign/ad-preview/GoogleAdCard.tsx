
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdPreview from "./google/GoogleAdPreview";
import GoogleAdCardHeader from "./google/GoogleAdCardHeader";
import GoogleAdDetails from "./google/GoogleAdDetails";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({ 
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
      <GoogleAdCardHeader 
        index={index} 
        ad={ad} 
      />
      <CardContent className="p-4 grid gap-4 md:grid-cols-2">
        <div>
          <GoogleAdPreview 
            ad={ad} 
            domain={getDomain(analysisResult.websiteUrl)} 
          />
        </div>
        <div>
          <GoogleAdDetails 
            ad={ad}
            onUpdate={onUpdate} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAdCard;

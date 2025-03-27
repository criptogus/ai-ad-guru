
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { getDomainFromUrl } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Copy } from "lucide-react";

interface MicrosoftAdsListProps {
  microsoftAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  onUpdateMicrosoftAd: (index: number, updatedAd: GoogleAd) => void;
}

const MicrosoftAdsList: React.FC<MicrosoftAdsListProps> = ({
  microsoftAds,
  analysisResult,
  onUpdateMicrosoftAd,
}) => {
  const domain = getDomainFromUrl(analysisResult.websiteUrl || "example.com");

  const handleCopyText = (ad: GoogleAd) => {
    const text = `Headlines: ${ad.headline1} | ${ad.headline2} | ${ad.headline3}\nDescriptions: ${ad.description1} ${ad.description2}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      {microsoftAds.map((ad, index) => (
        <Card key={`microsoft-ad-${index}`}>
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                {ad.headline1} | {ad.headline2} | {ad.headline3}
              </div>
              <div className="text-green-700 dark:text-green-500 text-sm mb-1">
                {domain}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {ad.description1}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {ad.description2}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onUpdateMicrosoftAd(index, { ...ad })}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCopyText(ad)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Text
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MicrosoftAdsList;

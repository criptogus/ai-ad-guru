
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { Input } from "@/components/ui/input";

interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  domain?: string;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

export const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({
  ad,
  domain = "example.com",
  onUpdate,
}) => {
  // Get the headlines and descriptions from the ad object, handling both formats
  const headlines = ad.headlines || [ad.headline1, ad.headline2, ad.headline3].filter(Boolean);
  const descriptions = ad.descriptions || [ad.description1, ad.description2].filter(Boolean);
  
  const handleHeadlineChange = (value: string, index: number) => {
    if (!onUpdate) return;
    
    const updatedHeadlines = [...headlines];
    updatedHeadlines[index] = value;
    
    const updatedAd = {...ad};
    
    if (ad.headlines) {
      updatedAd.headlines = updatedHeadlines;
    } else {
      // Handle the old format if needed
      if (index === 0) updatedAd.headline1 = value;
      if (index === 1) updatedAd.headline2 = value;
      if (index === 2) updatedAd.headline3 = value;
    }
    
    onUpdate(updatedAd);
  };
  
  const handleDescriptionChange = (value: string, index: number) => {
    if (!onUpdate) return;
    
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    
    const updatedAd = {...ad};
    
    if (ad.descriptions) {
      updatedAd.descriptions = updatedDescriptions;
    } else {
      // Handle the old format if needed
      if (index === 0) updatedAd.description1 = value;
      if (index === 1) updatedAd.description2 = value;
    }
    
    onUpdate(updatedAd);
  };

  return (
    <div className="text-sm space-y-3">
      <div className="space-y-1.5">
        {headlines.map((headline, index) => (
          <div key={`headline-${index}`} className="relative">
            <Input
              value={headline}
              onChange={(e) => handleHeadlineChange(e.target.value, index)}
              className="text-sm h-8 font-medium text-blue-600"
              maxLength={30}
              placeholder={`Headline ${index + 1} (max 30 chars)`}
              disabled={!onUpdate}
            />
            <div className="absolute right-2 top-1.5 text-xs text-muted-foreground">
              {headline?.length || 0}/30
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-1.5">
        {descriptions.map((description, index) => (
          <div key={`description-${index}`} className="relative">
            <Input
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value, index)}
              className="text-sm h-8"
              maxLength={90}
              placeholder={`Description ${index + 1} (max 90 chars)`}
              disabled={!onUpdate}
            />
            <div className="absolute right-2 top-1.5 text-xs text-muted-foreground">
              {description?.length || 0}/90
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex text-xs text-green-600">
        <span>
          {ad.finalUrl || ad.displayPath || domain || "www.example.com/offer"}
        </span>
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;

import React from "react";
import { GoogleAd } from "@/hooks/adGeneration/types";
import { MicrosoftAdPreview } from "./index";
import { getDomain } from "@/lib/utils";

interface MicrosoftAdsListProps {
  microsoftAds: GoogleAd[];
  analysisResult: any;
}

const MicrosoftAdsList: React.FC<MicrosoftAdsListProps> = ({ microsoftAds, analysisResult }) => {
  const domain = analysisResult?.websiteUrl ? getDomain(analysisResult.websiteUrl) : 'example.com';

  return (
    <div className="grid grid-cols-1 gap-4">
      {microsoftAds.map((ad, index) => (
        <div key={index} className="border rounded-md p-4">
          <h3 className="text-sm font-medium">Microsoft Ad #{index + 1}</h3>
          <MicrosoftAdPreview ad={ad} domain={domain} />
        </div>
      ))}
    </div>
  );
};

export default MicrosoftAdsList;

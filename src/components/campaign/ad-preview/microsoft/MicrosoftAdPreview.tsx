
import React from "react";
import { MicrosoftAd } from "@/hooks/adGeneration/types";
import { normalizeGoogleAd } from "@/lib/utils";

interface MicrosoftAdPreviewProps {
  ad: MicrosoftAd;
  domain: string;
}

const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ ad, domain }) => {
  // Normalize the ad to ensure it has headlines and descriptions arrays
  const normalizedAd = normalizeGoogleAd(ad);
  
  return (
    <div className="max-w-md">
      <div className="text-blue-600 text-sm font-medium">
        {normalizedAd.headlines?.join(" | ") || `${normalizedAd.headline1} | ${normalizedAd.headline2} | ${normalizedAd.headline3}`}
      </div>
      <div className="text-green-700 text-xs">
        {domain}/{normalizedAd.path1}/{normalizedAd.path2}
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-xs mt-1">
        {normalizedAd.descriptions?.join(" ") || `${normalizedAd.description1} ${normalizedAd.description2}`}
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;

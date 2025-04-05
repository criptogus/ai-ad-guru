
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MicrosoftAd } from "@/hooks/adGeneration/types";
import { normalizeGoogleAd } from "@/lib/utils";

interface MicrosoftAdCardProps {
  ad: MicrosoftAd;
  domain: string;
  index: number;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({ ad, domain, index }) => {
  // Normalize the ad to ensure it has headlines and descriptions arrays
  const normalizedAd = normalizeGoogleAd(ad);
  
  return (
    <div className="mt-2">
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

export default MicrosoftAdCard;

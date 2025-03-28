
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ ad, domain }) => {
  // Format headlines and descriptions for display
  const headline1 = ad.headline1 || ad.headlines?.[0] || "";
  const headline2 = ad.headline2 || ad.headlines?.[1] || "";
  const headline3 = ad.headline3 || ad.headlines?.[2] || "";
  const description1 = ad.description1 || ad.descriptions?.[0] || "";
  const description2 = ad.description2 || ad.descriptions?.[1] || "";

  return (
    <div className="max-w-lg">
      <div className="flex flex-col">
        <div>
          <div className="text-xs text-green-700">{domain}</div>
        </div>
        <div className="text-blue-600">
          <span className="font-medium">{headline1}</span>
          {headline2 && <span> | {headline2}</span>}
          {headline3 && <span> | {headline3}</span>}
        </div>
        <div className="text-sm text-gray-600">
          {description1}
          {description2 && (
            <span> {description2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;

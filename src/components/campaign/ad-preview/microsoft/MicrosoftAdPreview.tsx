
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

export interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  domain: string;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

export const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ ad, domain, onUpdate }) => {
  return (
    <div className="flex flex-col max-w-lg w-full">
      <div className="flex items-center text-xs text-gray-500 mb-1">
        <span className="text-sm text-gray-600">Ad · {domain}</span>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h2 className="text-blue-700 font-medium">{ad.headline1}</h2>
          <div className="flex gap-x-1">
            <span className="text-blue-700">{ad.headline2}</span>
            <span>·</span>
            <span className="text-blue-700">{ad.headline3}</span>
          </div>
        </div>
        <p className="text-sm text-gray-800 mt-1">{ad.description1}</p>
        <p className="text-sm text-gray-800">{ad.description2}</p>
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;

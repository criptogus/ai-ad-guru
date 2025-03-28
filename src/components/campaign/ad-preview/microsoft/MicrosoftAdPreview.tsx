
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ ad, domain }) => {
  return (
    <div className="border p-3 rounded-md bg-white">
      <div className="mb-1 flex items-center gap-1">
        <div className="text-xs text-emerald-700 font-semibold">Ad</div>
        <div className="text-gray-400">·</div>
        <div className="text-xs text-gray-500">{domain}</div>
      </div>
      
      <div className="space-y-1">
        <div className="flex flex-wrap gap-x-2">
          {ad.headlines?.map((headline, index) => (
            <div 
              key={`headline-${index}`} 
              className="text-blue-700 text-sm font-semibold hover:underline"
            >
              {headline}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-gray-800 leading-snug">
          {ad.descriptions?.map((description, index) => (
            <div key={`description-${index}`} className="mb-1">
              {description}
            </div>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-emerald-700 mt-1">
          {ad.displayPath ? (
            <>{domain}/{ad.displayPath}</>
          ) : (
            <>{domain}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;

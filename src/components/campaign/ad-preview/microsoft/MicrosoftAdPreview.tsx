
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ ad, domain }) => {
  return (
    <div className="flex flex-col space-y-2 p-3 border rounded-md bg-white">
      <div className="flex items-center">
        <img src="/microsoft-logo.png" alt="Microsoft" className="h-5 w-5 mr-2" onError={(e) => {e.currentTarget.style.display = 'none'}} />
        <span className="text-xs text-gray-500">Ad · {domain}</span>
      </div>
      
      <div className="flex flex-col">
        {ad.headlines && ad.headlines.map((headline, index) => (
          <div key={`headline-${index}`} className="text-blue-600 hover:underline cursor-pointer font-medium">
            {headline}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-600">
        {ad.descriptions && ad.descriptions.map((description, index) => (
          <div key={`description-${index}`}>
            {description}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-green-700 mt-1">
        {domain}{ad.displayPath && `/${ad.displayPath}`}
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;

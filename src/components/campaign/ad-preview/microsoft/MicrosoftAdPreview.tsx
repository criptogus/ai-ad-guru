
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ ad, domain }) => {
  return (
    <div className="max-w-[600px] font-sans text-left p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center mb-1">
        <div className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded mr-2">
          Ad
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{domain}</span>
      </div>
      
      {/* Headlines section with Microsoft styling */}
      <div className="space-y-0.5 mb-1">
        {ad.headlines.map((headline, index) => (
          <div 
            key={`headline-${index}`} 
            className="text-[#0066c0] dark:text-[#4cc2ff] font-medium hover:underline cursor-pointer"
          >
            {headline}
          </div>
        ))}
      </div>
      
      {/* Description section */}
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1.5">
        {ad.descriptions.map((description, index) => (
          <div key={`description-${index}`} className="line-clamp-2">
            {description}
          </div>
        ))}
      </div>
      
      {/* URL with Microsoft styling */}
      <div className="text-xs text-green-700 dark:text-green-500 mt-1 flex items-center">
        <span>{domain}</span>
        {ad.displayPath && (
          <span className="ml-1">/{ad.displayPath}</span>
        )}
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;

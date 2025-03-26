
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface GoogleAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const GoogleAdPreview: React.FC<GoogleAdPreviewProps> = ({ ad, domain }) => {
  return (
    <div className="max-w-[600px] font-sans text-left p-3 rounded-md">
      {/* Top section with Ad label */}
      <div className="flex items-start mb-1">
        <div className="inline-flex items-center mr-2">
          <div className="text-xs px-1 py-0.5 bg-[#FFFFFF] border border-[#626365] text-[#626365] rounded">
            Ad
          </div>
        </div>
        <div className="flex flex-col">
          {/* URL with paths */}
          <div className="text-xs text-green-700 mb-1 flex items-center">
            <span>https://{domain}</span>
            {ad.displayPath && (
              <>
                <span className="mx-1">›</span>
                <span>{ad.displayPath}</span>
              </>
            )}
          </div>
          
          {/* Headline section */}
          <div className="text-[#1a0dab] mb-1">
            <h3 className="text-lg font-medium leading-tight hover:underline cursor-pointer">
              {ad.headlines[0]}
              {ad.headlines[1] && (
                <>
                  <span className="mx-1 text-gray-500">•</span>
                  <span className="font-normal">{ad.headlines[1]}</span>
                </>
              )}
              {ad.headlines[2] && (
                <>
                  <span className="mx-1 text-gray-500">•</span>
                  <span className="font-normal">{ad.headlines[2]}</span>
                </>
              )}
            </h3>
          </div>
        </div>
      </div>
      
      {/* Description section */}
      <div className="text-sm text-[#4D5156] leading-snug">
        {ad.descriptions.map((description, index) => (
          <p key={index} className="line-clamp-2">
            {description}
          </p>
        ))}
      </div>
      
      {/* Site links (optional) */}
      {ad.siteLinks && ad.siteLinks.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {ad.siteLinks.slice(0, 4).map((sitelink, index) => (
            <div key={index} className="text-[#1a0dab] text-sm hover:underline cursor-pointer">
              {sitelink}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleAdPreview;

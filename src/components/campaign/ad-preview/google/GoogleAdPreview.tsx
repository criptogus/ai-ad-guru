
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface GoogleAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const GoogleAdPreview: React.FC<GoogleAdPreviewProps> = ({ ad, domain }) => {
  return (
    <div className="max-w-[600px] font-sans text-left">
      {/* Ad Label */}
      <div className="inline-block text-xs px-1 bg-[#FFFFFF] border border-[#626365] text-[#626365] rounded mb-1">
        Ad
      </div>
      
      {/* Domain and path */}
      <div className="text-sm text-[#202124] mb-1 font-medium truncate">
        {domain}
      </div>
      
      {/* Main URL */}
      <div className="flex items-center text-xs text-green-700 mb-1">
        <span>https://{domain}</span>
        {/* Path */}
        <span className="hidden sm:inline-block mx-1">›</span>
        <span className="hidden sm:inline-block">service</span>
      </div>
      
      {/* Headlines */}
      <div className="text-blue-700 mb-1">
        <h3 className="text-lg font-medium leading-tight">
          {ad.headlines[0]}
          {ad.headlines[1] && (
            <span className="mx-1 text-gray-500">•</span>
          )}
          <span className="font-normal">
            {ad.headlines[1]}
          </span>
          {ad.headlines[2] && (
            <>
              <span className="mx-1 text-gray-500">•</span>
              <span className="font-normal">
                {ad.headlines[2]}
              </span>
            </>
          )}
        </h3>
      </div>
      
      {/* Descriptions */}
      <div className="text-sm text-[#4D5156] leading-snug">
        {ad.descriptions.map((description, index) => (
          <p key={index} className="line-clamp-2">
            {description}
          </p>
        ))}
      </div>
    </div>
  );
};

export default GoogleAdPreview;

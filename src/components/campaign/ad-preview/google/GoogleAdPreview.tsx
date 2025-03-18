
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";

interface GoogleAdPreviewProps {
  ad: GoogleAd;
  domain: string;
}

const GoogleAdPreview: React.FC<GoogleAdPreviewProps> = ({ ad, domain }) => {
  return (
    <div className="border rounded-md overflow-hidden mb-4">
      <div className="p-4">
        {/* Ad Badge */}
        <div className="flex items-center mb-1">
          <span className="text-[11px] px-[4px] py-[1px] mr-1 rounded bg-white text-[#1a73e8] border border-[#1a73e8]">Ad</span>
          <span className="text-xs text-gray-500">{domain}</span>
        </div>
        
        {/* URL Path */}
        <div className="text-[#202124] text-sm mb-1">
          {domain}
        </div>
        
        {/* Headline - With pipes between each headline */}
        <div className="text-[#1a0dab] font-medium text-xl leading-tight cursor-pointer hover:underline mb-1">
          {ad.headlines.map((headline, i) => (
            <span key={i}>
              {headline}
              {i < ad.headlines.length - 1 && <span className="text-gray-400"> | </span>}
            </span>
          ))}
        </div>
        
        {/* Descriptions */}
        <div className="text-[#4d5156] text-sm mt-1">
          {ad.descriptions.map((desc, i) => (
            <div key={i}>{desc}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleAdPreview;

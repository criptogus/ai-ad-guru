
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { ExternalLink } from "lucide-react";

interface GoogleAdPreviewProps {
  ad: GoogleAd;
  domain?: string;
}

const GoogleAdPreview: React.FC<GoogleAdPreviewProps> = ({ ad, domain = "example.com" }) => {
  // Parse sitelinks if they exist
  const hasSitelinks = ad.siteLinks && ad.siteLinks.length > 0;
  
  // Function to render sitelinks in a grid
  const renderSitelinks = () => {
    if (!hasSitelinks) return null;
    
    // Create a 2x2 grid of sitelinks
    const siteLinks = ad.siteLinks || [];
    const rows = [];
    
    for (let i = 0; i < Math.min(siteLinks.length, 4); i += 2) {
      const row = (
        <div className="flex space-x-4" key={`sitelink-row-${i}`}>
          {siteLinks[i] && (
            <div className="flex-1">
              <a 
                href="#" 
                className="text-[#1a0dab] hover:underline text-sm font-medium block truncate"
                onClick={(e) => e.preventDefault()}
              >
                {siteLinks[i].title}
              </a>
            </div>
          )}
          {siteLinks[i + 1] && (
            <div className="flex-1">
              <a 
                href="#" 
                className="text-[#1a0dab] hover:underline text-sm font-medium block truncate"
                onClick={(e) => e.preventDefault()}
              >
                {siteLinks[i + 1].title}
              </a>
            </div>
          )}
        </div>
      );
      rows.push(row);
    }
    
    return (
      <div className="mt-1 space-y-1">
        {rows}
      </div>
    );
  };

  return (
    <div className="max-w-xl font-sans text-left">
      {/* Ad Badge & URL */}
      <div className="flex items-center mb-1">
        <span className="text-xs mr-2 px-1 rounded bg-[#ebebeb] text-[#5f6368]">Ad</span>
        <span className="text-[#202124] text-xs">
          {ad.displayPath || `www.${domain}/${ad.path1 || ''}${ad.path2 ? '/' + ad.path2 : ''}`}
        </span>
      </div>
      
      {/* Headline */}
      <h3 className="text-[#1a0dab] text-xl leading-tight mb-1 font-normal">
        {ad.headline1} {ad.headline2 && <span>| {ad.headline2}</span>} {ad.headline3 && <span>| {ad.headline3}</span>}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-[#4d5156] leading-snug mb-1">
        {ad.description1} {ad.description2 && <span>{ad.description2}</span>}
      </p>
      
      {/* Sitelinks if they exist */}
      {renderSitelinks()}
    </div>
  );
};

export default GoogleAdPreview;

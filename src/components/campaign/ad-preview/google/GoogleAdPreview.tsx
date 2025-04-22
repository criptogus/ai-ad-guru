
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleAdPreviewProps {
  ad: GoogleAd;
  domain?: string;
  className?: string;
}

const GoogleAdPreview: React.FC<GoogleAdPreviewProps> = ({ 
  ad, 
  domain = "example.com",
  className
}) => {
  // Format display URL
  const displayUrl = ad.displayPath || `${domain}/${ad.path1 || ''}${ad.path2 ? '/' + ad.path2 : ''}`;
  
  // Parse sitelinks if they exist
  const hasSitelinks = ad.siteLinks && ad.siteLinks.length > 0;
  
  // Format description text to ensure proper spacing after periods
  const formatDescription = (text: string) => {
    if (!text) return "";
    // Replace periods that aren't followed by a space with period + space
    return text.replace(/\.(?!\s|$)/g, '. ');
  };
  
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
                {typeof siteLinks[i] === 'string' ? siteLinks[i] : siteLinks[i].title}
              </a>
              {typeof siteLinks[i] !== 'string' && siteLinks[i].description && (
                <p className="text-xs text-[#4d5156] truncate">{siteLinks[i].description}</p>
              )}
            </div>
          )}
          {siteLinks[i + 1] && (
            <div className="flex-1">
              <a 
                href="#" 
                className="text-[#1a0dab] hover:underline text-sm font-medium block truncate"
                onClick={(e) => e.preventDefault()}
              >
                {typeof siteLinks[i + 1] === 'string' ? siteLinks[i + 1] : siteLinks[i + 1].title}
              </a>
              {typeof siteLinks[i + 1] !== 'string' && siteLinks[i + 1].description && (
                <p className="text-xs text-[#4d5156] truncate">{siteLinks[i + 1].description}</p>
              )}
            </div>
          )}
        </div>
      );
      rows.push(row);
    }
    
    return (
      <div className="mt-2 space-y-2">
        {rows}
      </div>
    );
  };

  return (
    <div className={cn("max-w-xl font-sans text-left p-4 bg-white border rounded-lg shadow-sm", className)}>
      {/* Ad Badge & URL */}
      <div className="flex items-center mb-2">
        <span className="text-xs mr-2 px-1.5 py-0.5 rounded bg-[#ebebeb] text-[#5f6368] font-medium">Ad</span>
        <span className="text-[#202124] text-xs">
          <span className="text-[#1e8e3e] font-medium">{displayUrl}</span>
          <span className="text-[#5f6368] ml-1">· Ad</span>
        </span>
      </div>
      
      {/* Headline */}
      <h3 className="text-[#1a0dab] text-xl leading-tight mb-2 font-medium hover:underline cursor-pointer">
        {ad.headline1 || ad.headlines?.[0] || "Headline 1"} 
        {(ad.headline2 || ad.headlines?.[1]) && <span> | {ad.headline2 || ad.headlines?.[1]}</span>} 
        {(ad.headline3 || ad.headlines?.[2]) && <span> | {ad.headline3 || ad.headlines?.[2]}</span>}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-[#4d5156] leading-snug mb-2">
        {formatDescription(ad.description1 || ad.descriptions?.[0] || "Description 1")} 
        {ad.description2 || ad.descriptions?.[1] ? formatDescription(ad.description2 || ad.descriptions?.[1] || "") : ""}
      </p>
      
      {/* Final URL indicator */}
      {ad.finalUrl && (
        <div className="text-xs text-[#4d5156] mb-2 flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" />
          {ad.finalUrl}
        </div>
      )}
      
      {/* Sitelinks if they exist */}
      {renderSitelinks()}
    </div>
  );
};

export default GoogleAdPreview;

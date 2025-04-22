
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { cn } from "@/lib/utils";

interface MicrosoftAdPreviewProps {
  ad: GoogleAd;
  domain?: string;
  className?: string;
}

const MicrosoftAdPreview: React.FC<MicrosoftAdPreviewProps> = ({ 
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
  
  // Function to render sitelinks in a horizontal layout
  const renderSitelinks = () => {
    if (!hasSitelinks) return null;
    
    // Create a horizontal layout of sitelinks
    const siteLinks = ad.siteLinks || [];
    
    return (
      <div className="ad-sitelinks flex flex-wrap mt-2">
        {siteLinks.slice(0, 4).map((link, index) => (
          <a 
            key={`sitelink-${index}`}
            href="#" 
            className="sitelink text-[#1a0dab] text-sm mr-4 mb-1 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            {typeof link === 'string' ? link : link.title}
          </a>
        ))}
      </div>
    );
  };
  
  // Function to render callouts in a horizontal layout (example feature extensions)
  const renderCallouts = () => {
    // Example callouts (in a real implementation, this would come from the ad data)
    const callouts = ["Free Shipping", "24-Month Warranty", "24/7 Support"];
    
    return (
      <div className="ad-callouts flex flex-wrap mt-2">
        {callouts.map((callout, index) => (
          <span 
            key={`callout-${index}`}
            className="callout text-[#444] text-xs mr-3 mb-1"
          >
            {callout}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("font-sans text-left p-3 bg-[#f2f2f2] border rounded-md", className)}>
      {/* Ad Badge */}
      <div className="ad-label text-[#767676] text-xs mb-1">Ad</div>
      
      {/* Title */}
      <div className="ad-title mb-1">
        <a 
          href="#" 
          className="title-link text-[#1a0dab] text-lg font-semibold leading-tight hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          {ad.headline1 || ad.headlines?.[0] || "Headline 1"} 
        </a>
      </div>
      
      {/* URL */}
      <div className="ad-url mb-1">
        <a 
          href="#" 
          className="url-link text-[#006d21] text-sm hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          {displayUrl}
        </a>
      </div>
      
      {/* Description */}
      <div className="ad-description text-sm text-[#444] leading-snug">
        {formatDescription(ad.description1 || ad.descriptions?.[0] || "Description 1")} 
        {ad.description2 || ad.descriptions?.[1] ? formatDescription(ad.description2 || ad.descriptions?.[1] || "") : ""}
      </div>
      
      {/* Ad Extensions */}
      <div className="ad-extensions mt-2">
        {renderSitelinks()}
        {renderCallouts()}
      </div>
    </div>
  );
};

export default MicrosoftAdPreview;


import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface ContentSectionProps {
  ad: MetaAd;
  companyName: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ ad, companyName }) => {
  // Format hashtags if they exist
  const formattedHashtags = () => {
    if (!ad.hashtags) return null;
    
    let tags: string[] = [];
    if (typeof ad.hashtags === 'string') {
      // If it's a string, split by spaces or commas
      tags = ad.hashtags.split(/[\s,]+/).filter(tag => tag.trim());
    } else if (Array.isArray(ad.hashtags)) {
      tags = ad.hashtags;
    }
    
    return tags.map(tag => {
      // Add # if it doesn't already have one
      const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
      return (
        <span key={tag} className="text-blue-500 mr-1">
          {formattedTag}
        </span>
      );
    });
  };
  
  // Format text with line breaks
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-start">
        <div className="font-semibold mr-2">{companyName}</div>
        <div className="text-sm flex-1">
          {ad.primaryText && formatText(ad.primaryText)}
        </div>
      </div>
      
      {ad.hashtags && (
        <div className="text-sm">
          {formattedHashtags()}
        </div>
      )}
      
      {ad.description && (
        <div className="text-sm font-medium text-blue-600">
          {ad.description}
        </div>
      )}
    </div>
  );
};

export default ContentSection;

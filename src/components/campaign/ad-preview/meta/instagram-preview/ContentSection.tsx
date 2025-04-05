
import React from "react";
import { MetaAd } from "@/hooks/adGeneration/types";

interface ContentSectionProps {
  ad: MetaAd;
  companyName: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ ad, companyName }) => {
  // Parse hashtags from the ad
  const renderHashtags = () => {
    if (!ad.hashtags || (Array.isArray(ad.hashtags) && ad.hashtags.length === 0)) {
      return null;
    }

    let hashtagArray: string[] = [];
    
    if (typeof ad.hashtags === 'string') {
      hashtagArray = ad.hashtags.split(/[,\s]+/).filter(Boolean);
    } else if (Array.isArray(ad.hashtags)) {
      hashtagArray = ad.hashtags;
    }

    return hashtagArray.map((tag, index) => {
      const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
      return (
        <span key={index} className="text-blue-500">
          {formattedTag}{' '}
        </span>
      );
    });
  };

  return (
    <div className="px-3 py-2">
      <p className="text-sm whitespace-pre-line mb-2">
        {ad.primaryText}
        {renderHashtags() && (
          <span className="block mt-1">
            {renderHashtags()}
          </span>
        )}
      </p>
    </div>
  );
};

export default ContentSection;


import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({
  ad,
  companyName
}) => {
  // Process hashtags - might be string or array
  const renderHashtags = () => {
    if (!ad.hashtags) return null;
    
    // Handle both string and array formats
    const hashtagArray = Array.isArray(ad.hashtags) 
      ? ad.hashtags 
      : ad.hashtags.split(/[\s,]+/);
    
    if (hashtagArray.length === 0) return null;
    
    return (
      <div className="mt-1 text-sm text-blue-500">
        {hashtagArray.map((tag, idx) => {
          // Ensure the tag has a # prefix
          const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
          return (
            <span key={idx} className="mr-1">{formattedTag}</span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-2 text-xs text-gray-500">
      <div>View all comments</div>
      <div className="mt-1 text-gray-400">3 DAYS AGO</div>
      {renderHashtags()}
    </div>
  );
};

export default InstagramPreviewFooter;

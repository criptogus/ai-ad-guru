
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { normalizeMetaAd } from "@/lib/utils";

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({ 
  ad, 
  companyName 
}) => {
  // Normalize the ad to ensure it has hashtags
  const normalizedAd = normalizeMetaAd(ad);
  
  // Process hashtags - might be string or array
  const renderHashtags = () => {
    if (!normalizedAd.hashtags) return null;
    
    // Handle both string and array formats
    const hashtagArray = Array.isArray(normalizedAd.hashtags) 
      ? normalizedAd.hashtags 
      : normalizedAd.hashtags.split(/[\s,]+/);
    
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
    <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-muted-foreground">
      <div className="flex justify-between">
        <div>
          {normalizedAd.description && (
            <span>{normalizedAd.description}</span>
          )}
        </div>
        <div>
          <span>Sponsored</span>
        </div>
      </div>
    </div>
  );
};

export default InstagramPreviewFooter;

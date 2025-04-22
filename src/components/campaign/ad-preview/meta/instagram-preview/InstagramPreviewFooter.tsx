
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({ ad, companyName }) => {
  // Format hashtags as string if they exist
  const getHashtagsText = () => {
    if (!ad.hashtags) return "";
    
    if (typeof ad.hashtags === 'string') {
      return ad.hashtags;
    }
    
    if (Array.isArray(ad.hashtags)) {
      // If it's an array, join with spaces
      return ad.hashtags.map(tag => {
        // Add # if it doesn't already have one
        return tag.startsWith('#') ? tag : `#${tag}`;
      }).join(' ');
    }
    
    return "";
  };
  
  // Ensure text is properly formatted and complete
  const ensureCompleteText = (text: string): string => {
    if (!text) return "";
    
    // Make sure the text ends with proper punctuation
    const trimmedText = text.trim();
    if (!trimmedText.match(/[.!?;:]$/)) {
      return trimmedText + ".";
    }
    
    return trimmedText;
  };
  
  // Format caption with hashtags
  const getCaption = () => {
    // Ensure primary text is complete
    const caption = ensureCompleteText(ad.primaryText || "");
    const hashtags = getHashtagsText();
    
    if (!caption && !hashtags) return null;
    
    if (!caption) return hashtags;
    if (!hashtags) return caption;
    
    // If both exist, combine them
    return `${caption}\n\n${hashtags}`;
  };

  const caption = getCaption();
  
  if (!caption) return null;

  return (
    <div className="mt-2 text-sm">
      <div>
        <span className="font-semibold">{companyName}</span>{" "}
        <span className="line-clamp-3">
          {/* Render first paragraph of caption */}
          {caption.split('\n\n')[0]}
        </span>
      </div>
      {caption.includes('\n\n') && (
        <div className="text-gray-500 mt-1">
          {/* Show indication that there's more */}
          mais...
        </div>
      )}
    </div>
  );
};

export default InstagramPreviewFooter;


import React from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";

interface ContentSectionProps {
  ad: MetaAd;
  companyName: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ ad, companyName }) => {
  // Extract hashtags if present
  const extractHashtags = (text?: string): string[] => {
    if (!text) return [];
    const hashtagRegex = /#[^\s#]+/g;
    return text.match(hashtagRegex) || [];
  };

  // Format the caption text, handling hashtags differently
  const formatCaption = (text?: string): React.ReactNode => {
    if (!text) return null;
    
    // Replace hashtags with links
    const parts = text.split(/(#[^\s#]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-blue-500 dark:text-blue-400">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Get hashtags from ad.hashtags (if it exists) or extract from primaryText
  const getHashtags = (): string[] => {
    if (ad.hashtags) {
      if (Array.isArray(ad.hashtags)) {
        return ad.hashtags;
      } else if (typeof ad.hashtags === 'string') {
        return ad.hashtags.split(/\s+/).filter(tag => tag.startsWith('#'));
      }
    }
    return extractHashtags(ad.primaryText);
  };

  const hashtags = getHashtags();

  return (
    <div className="p-3">
      {/* Action buttons */}
      <div className="flex justify-between mb-2">
        <div className="flex space-x-4">
          <Heart className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
          <Send className="w-6 h-6" />
        </div>
        <Bookmark className="w-6 h-6" />
      </div>
      
      {/* Likes */}
      <div className="text-sm font-semibold mb-2">
        12,345 likes
      </div>
      
      {/* Caption */}
      <div className="text-sm mb-1">
        <span className="font-semibold mr-1">{companyName}</span>
        {formatCaption(ad.primaryText)}
      </div>
      
      {/* Hashtags in separate line if not already in the caption */}
      {hashtags.length > 0 && !ad.primaryText?.includes('#') && (
        <div className="text-sm text-blue-500 dark:text-blue-400 mb-1">
          {hashtags.join(' ')}
        </div>
      )}
      
      {/* View all comments */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        View all 123 comments
      </div>
      
      {/* Post date */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        2 HOURS AGO
      </div>
    </div>
  );
};

export default ContentSection;

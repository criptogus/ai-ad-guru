
import React from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({ ad, companyName }) => {
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
    <div className="p-3">
      <div className="flex justify-between mb-2">
        <div className="flex gap-4">
          <Heart className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
          <Send className="w-6 h-6" />
        </div>
        <Bookmark className="w-6 h-6" />
      </div>
      
      <div className="text-sm">
        <p className="font-semibold mb-1">127 likes</p>
        <p>
          <span className="font-semibold mr-1">{companyName}</span>
          {ad.description}
        </p>
        {renderHashtags() && (
          <p className="mt-1">
            {renderHashtags()}
          </p>
        )}
        <p className="text-gray-500 text-xs mt-1">View all 24 comments</p>
        <p className="text-gray-400 text-xs mt-1">2 HOURS AGO</p>
      </div>
    </div>
  );
};

export default InstagramPreviewFooter;


import React from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { MetaAd } from '@/hooks/adGeneration';

interface InstagramPreviewFooterProps {
  ad: MetaAd;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({ ad }) => {
  return (
    <div className="px-3 pt-2">
      <div className="flex justify-between mb-2">
        <div className="flex space-x-4">
          <Heart className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
          <Send className="w-6 h-6" />
        </div>
        <Bookmark className="w-6 h-6" />
      </div>
      <div className="font-medium mb-1">1,234 likes</div>
      <div className="text-sm">
        <div className="mb-1">
          <span className="font-medium mr-1">yourcompany</span>
          {ad.primaryText}
        </div>
        {ad.hashtags && ad.hashtags.length > 0 && (
          <div className="text-blue-500">
            {ad.hashtags.join(' ')}
          </div>
        )}
        <div className="text-gray-500 mt-1">View all 48 comments</div>
        <div className="text-xs text-gray-400 mt-1">2 DAYS AGO</div>
      </div>
    </div>
  );
};

export default InstagramPreviewFooter;

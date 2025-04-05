
import React from 'react';
import { MetaAd } from '@/hooks/adGeneration';

interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({ ad, companyName }) => {
  // Function to format hashtags from array or string
  const renderHashtags = (): string => {
    // If hashtags is undefined or empty, generate default ones
    if (!ad.hashtags || (Array.isArray(ad.hashtags) && ad.hashtags.length === 0)) {
      // Generate default hashtags based on company name and ad content
      const companyTag = companyName.replace(/\s+/g, '');
      return `#${companyTag} #marketing #business`;
    }

    // If hashtags is an array, join with spaces
    if (Array.isArray(ad.hashtags)) {
      return ad.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
    }

    // If hashtags is a string, return as is or format properly
    return typeof ad.hashtags === 'string' 
      ? ad.hashtags.startsWith('#') ? ad.hashtags : `#${ad.hashtags}` 
      : '';
  };

  // Number of mock likes (random but deterministic based on ad content)
  const getLikeCount = (): number => {
    const seed = (ad.headline.length * ad.primaryText.length) % 1000;
    return 100 + seed;
  };
  
  // Calculate time ago (1-10 hours ago)
  const getTimeAgo = (): string => {
    const hours = 1 + (ad.headline.length % 10);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Likes count */}
      <div className="text-sm font-medium">{getLikeCount()} likes</div>
      
      {/* Hashtags */}
      <div className="text-sm text-blue-500 dark:text-blue-400">
        {renderHashtags()}
      </div>
      
      {/* View comments and time */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <span>View all 24 comments</span>
        <span>{getTimeAgo()}</span>
      </div>
    </div>
  );
};

export default InstagramPreviewFooter;


import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface ContentSectionProps {
  ad: MetaAd;
  companyName: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ ad, companyName }) => {
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
    <div className="p-3">
      {/* Action buttons */}
      <div className="flex justify-between mb-2">
        <div className="flex gap-3">
          <button>❤️</button>
          <button>💬</button>
          <button>📤</button>
        </div>
        <button>🔖</button>
      </div>
      
      {/* Likes count */}
      <div className="mb-2 text-sm font-medium">1,234 likes</div>
      
      {/* Caption */}
      <div className="mb-2 text-sm">
        <span className="font-medium">{companyName}</span>{" "}
        <span>{ad.primaryText}</span>
      </div>
      
      {/* Hashtags */}
      {renderHashtags()}
      
      {/* View comments */}
      <div className="mt-2 text-sm text-gray-500">View all 123 comments</div>
      
      {/* Add comment section */}
      <div className="mt-4 flex items-center">
        <input 
          type="text" 
          placeholder="Add a comment..." 
          className="w-full bg-transparent text-sm outline-none"
        />
        <button className="text-blue-500 text-sm font-semibold">Post</button>
      </div>
    </div>
  );
};

export default ContentSection;

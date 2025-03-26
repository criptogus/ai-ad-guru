
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

export interface InstagramPreviewFooterProps {
  ad: MetaAd;
  companyName: string;
}

const InstagramPreviewFooter: React.FC<InstagramPreviewFooterProps> = ({
  ad,
  companyName
}) => {
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
      <p className="line-clamp-1">
        {ad.hashtags && ad.hashtags.map((tag, i) => (
          <span key={i} className="text-blue-500 mr-1">#{tag}</span>
        ))}
      </p>
      <p className="mt-1">
        View all comments
      </p>
      <p className="mt-2 text-[10px] uppercase">
        {Math.floor(Math.random() * 3) + 1} days ago
      </p>
    </div>
  );
};

export default InstagramPreviewFooter;

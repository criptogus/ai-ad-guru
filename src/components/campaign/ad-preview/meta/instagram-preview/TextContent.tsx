
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface TextContentProps {
  ad: MetaAd;
}

const TextContent: React.FC<TextContentProps> = ({ ad }) => {
  return (
    <div className="p-3">
      <div className="text-sm">
        <span className="font-semibold mr-1">Caption:</span>
        <span>{ad.primaryText || "Your engaging caption here..."}</span>
      </div>
      {ad.hashtags && ad.hashtags.length > 0 && (
        <div className="text-sm text-blue-500 mt-1">
          {ad.hashtags.map((tag, index) => (
            <span key={index}>#{tag} </span>
          ))}
        </div>
      )}
      {ad.callToAction && (
        <div className="mt-2 text-sm">
          <button className="font-semibold text-blue-900">
            {ad.callToAction}
          </button>
        </div>
      )}
    </div>
  );
};

export default TextContent;

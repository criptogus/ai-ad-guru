
import React from "react";

interface InstagramPreviewHeaderProps {
  companyName: string;
  format?: "feed" | "story" | "reel";
}

const InstagramPreviewHeader: React.FC<InstagramPreviewHeaderProps> = ({ 
  companyName,
  format = "feed"
}) => {
  if (format === "story" || format === "reel") {
    return (
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2">
        <div className="flex items-center text-white text-xs">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mr-2">
            {companyName.substring(0, 1).toUpperCase()}
          </div>
          <span className="font-medium">{companyName}</span>
        </div>
        <div className="text-white text-xs">
          {format === "story" ? "Story" : "Reel"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mr-2">
          {companyName.substring(0, 1).toUpperCase()}
        </div>
        <span className="text-sm font-medium">{companyName}</span>
      </div>
      <div className="text-gray-500 dark:text-gray-400">
        <span className="text-xs">Sponsored</span>
      </div>
    </div>
  );
};

export default InstagramPreviewHeader;

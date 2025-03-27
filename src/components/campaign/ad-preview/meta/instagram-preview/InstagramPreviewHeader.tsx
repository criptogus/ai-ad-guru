
import React from "react";
import { MoreHorizontal } from "lucide-react";

interface InstagramPreviewHeaderProps {
  companyName: string;
  format?: string;
}

const InstagramPreviewHeader: React.FC<InstagramPreviewHeaderProps> = ({
  companyName,
  format = "feed"
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-700">
      <div className="flex items-center">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex-shrink-0"></div>
        <div className="ml-2">
          <p className="text-sm font-semibold">{companyName}</p>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
      </div>
      <button className="text-gray-700 dark:text-gray-300">
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
};

export default InstagramPreviewHeader;

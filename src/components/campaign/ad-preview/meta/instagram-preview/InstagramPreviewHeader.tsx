
import React from "react";

interface InstagramPreviewHeaderProps {
  companyName: string;
}

const InstagramPreviewHeader: React.FC<InstagramPreviewHeaderProps> = ({ companyName }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs overflow-hidden">
          {companyName.slice(0, 1).toUpperCase()}
        </div>
        <div className="font-semibold ml-2">{companyName}</div>
      </div>
      <div className="text-gray-600">...</div>
    </div>
  );
};

export default InstagramPreviewHeader;

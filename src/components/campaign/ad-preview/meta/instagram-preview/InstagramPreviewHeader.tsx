
import React from "react";

interface InstagramPreviewHeaderProps {
  companyName: string;
}

const InstagramPreviewHeader: React.FC<InstagramPreviewHeaderProps> = ({
  companyName
}) => {
  return (
    <div className="bg-white p-3 border-b flex items-center">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
      <div className="ml-2 flex-grow">
        <div className="font-semibold text-sm">{companyName}</div>
        <div className="text-xs text-gray-500">Sponsored</div>
      </div>
      <div className="text-gray-500">•••</div>
    </div>
  );
};

export default InstagramPreviewHeader;

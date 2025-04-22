
import React from "react";

interface InstagramPreviewHeaderProps {
  companyName: string;
}

const InstagramPreviewHeader: React.FC<InstagramPreviewHeaderProps> = ({ companyName }) => {
  return (
    <div className="p-3 flex items-center border-b">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex-shrink-0" />
      <div className="ml-2 flex-grow">
        <div className="text-sm font-medium">{companyName}</div>
        <div className="text-xs text-gray-500">Sponsored</div>
      </div>
      <div className="text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </div>
    </div>
  );
};

export default InstagramPreviewHeader;

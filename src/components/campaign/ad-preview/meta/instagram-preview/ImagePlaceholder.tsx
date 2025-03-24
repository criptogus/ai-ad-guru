
import React from "react";

export interface ImagePlaceholderProps {
  text: string;
  onClick: () => Promise<void>;
  viewType: "feed" | "story" | "reel";
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ text, onClick, viewType }) => {
  return (
    <div 
      className={`w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
        viewType === "feed" ? "aspect-square" : viewType === "story" ? "aspect-[9/16]" : "aspect-[9/16]"
      }`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="text-gray-600 dark:text-gray-400 text-sm text-center px-4">
        {text}
      </p>
    </div>
  );
};

export default ImagePlaceholder;

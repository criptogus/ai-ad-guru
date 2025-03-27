
import React from "react";
import { Image, Upload } from "lucide-react";

interface ImagePlaceholderProps {
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload?: () => void;
  isLoading?: boolean;
  isUploading?: boolean;
  imageError?: boolean;
  format?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  onGenerateImage,
  triggerFileUpload,
  isLoading = false,
  isUploading = false,
  imageError = false,
  format = "feed"
}) => {
  // Determine appropriate placeholder message based on format
  const getPlaceholderMessage = () => {
    switch (format) {
      case "story":
        return "Add a story image";
      case "reel":
        return "Add a reel cover";
      default:
        return "Add an image";
    }
  };

  // Determine background style based on format
  const getBackgroundStyle = () => {
    switch (format) {
      case "story":
      case "reel":
        return "bg-gradient-to-br from-gray-800 to-gray-900";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  // Determine text color based on format
  const getTextColorStyle = () => {
    switch (format) {
      case "story":
      case "reel":
        return "text-white/80";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${getBackgroundStyle()}`}>
      {imageError ? (
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">
            <svg
              className="w-8 h-8 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs mt-1">Failed to load image</p>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            {onGenerateImage && (
              <button
                onClick={onGenerateImage}
                disabled={isLoading || isUploading}
                className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <Image className="h-3 w-3" />
                Generate
              </button>
            )}
            {triggerFileUpload && (
              <button
                onClick={triggerFileUpload}
                disabled={isLoading || isUploading}
                className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <Upload className="h-3 w-3" />
                Upload
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-4">
          <div className={`${getTextColorStyle()} mb-2`}>
            <Image className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-xs mt-1">{getPlaceholderMessage()}</p>
          </div>
          
          <div className="flex gap-2 justify-center mt-2">
            {onGenerateImage && (
              <button
                onClick={onGenerateImage}
                disabled={isLoading || isUploading}
                className={`${
                  format === "story" || format === "reel"
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
                } text-xs px-2 py-1 rounded-md flex items-center gap-1 transition-colors`}
              >
                <Image className="h-3 w-3" />
                Generate
              </button>
            )}
            
            {triggerFileUpload && (
              <button
                onClick={triggerFileUpload}
                disabled={isLoading || isUploading}
                className={`${
                  format === "story" || format === "reel"
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
                } text-xs px-2 py-1 rounded-md flex items-center gap-1 transition-colors`}
              >
                <Upload className="h-3 w-3" />
                Upload
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePlaceholder;

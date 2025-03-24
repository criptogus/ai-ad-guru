
import React from "react";

export interface ImagePlaceholderProps {
  isLoading?: boolean;
  isUploading?: boolean;
  imageError?: boolean;
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload?: () => void;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  isLoading = false, 
  isUploading = false, 
  imageError = false,
  onGenerateImage,
  triggerFileUpload
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center p-4">
        {imageError ? (
          <>
            <p className="text-red-500 mb-2">Failed to load image</p>
            <button 
              onClick={onGenerateImage} 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </>
        ) : isLoading || isUploading ? (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <svg
              className="animate-spin h-8 w-8 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm">{isUploading ? "Uploading..." : "Generating image..."}</span>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No image available</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button 
                onClick={onGenerateImage} 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                Generate with AI
              </button>
              <button 
                onClick={triggerFileUpload} 
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors text-sm"
              >
                Upload Image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImagePlaceholder;

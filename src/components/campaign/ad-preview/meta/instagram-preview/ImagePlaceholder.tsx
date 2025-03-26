
import React from "react";
import { ImageIcon, Upload, Sparkles } from "lucide-react";

export interface ImagePlaceholderProps {
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
  const getFormatClass = () => {
    switch (format) {
      case "story":
        return "aspect-[9/16]";
      case "portrait":
        return "aspect-[4/5]";
      case "landscape":
        return "aspect-video";
      default: // feed/square
        return "aspect-square";
    }
  };

  return (
    <div className={`w-full ${getFormatClass()} flex flex-col items-center justify-center p-6 ${
      imageError ? "bg-red-50 border-red-200" : "bg-gray-50 dark:bg-gray-800"
    }`}>
      <div className="mb-4">
        <ImageIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {imageError
            ? "Error loading image. Please try again."
            : "Add an image to your ad"}
        </p>
        
        <div className="flex flex-col gap-2">
          {onGenerateImage && (
            <button
              onClick={onGenerateImage}
              disabled={isLoading || isUploading}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isLoading ? "Generating..." : "Generate with AI"}</span>
            </button>
          )}
          
          {triggerFileUpload && (
            <button
              onClick={triggerFileUpload}
              disabled={isLoading || isUploading}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;

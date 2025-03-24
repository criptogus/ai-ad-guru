
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, RefreshCw } from "lucide-react";

interface ImagePlaceholderProps {
  isLoading: boolean;
  isUploading: boolean;
  imageError: boolean;
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload: () => void;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  isLoading,
  isUploading,
  imageError,
  onGenerateImage,
  triggerFileUpload
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      {isLoading ? (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Generating AI image...</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This might take a moment</p>
        </div>
      ) : isUploading ? (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Uploading image...</p>
        </div>
      ) : imageError ? (
        <div className="flex flex-col items-center text-center">
          <div className="text-red-500 mb-2">
            <RefreshCw className="h-8 w-8" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Failed to load image</p>
          <div className="flex gap-2">
            {onGenerateImage && (
              <Button variant="outline" size="sm" onClick={onGenerateImage}>
                Try Again
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={triggerFileUpload}>
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 text-gray-400 dark:text-gray-500">
            <Upload className="h-12 w-12" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">No image yet</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {onGenerateImage && (
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white" 
                size="sm" 
                onClick={onGenerateImage}
              >
                Generate AI Image
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={triggerFileUpload}>
              <Upload className="h-4 w-4 mr-1" />
              Upload Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePlaceholder;

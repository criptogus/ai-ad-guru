
import React from "react";
import { Loader2, Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePlaceholderProps {
  isLoading: boolean;
  isUploading: boolean;
  imageError: boolean;
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload: () => void;
  format?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  isLoading,
  isUploading,
  imageError,
  onGenerateImage,
  triggerFileUpload,
  format = "feed"
}) => {
  // Get format-specific styles
  const getFormatClasses = () => {
    if (format === "story" || format === "reel") {
      return "aspect-[9/16]";
    }
    return "aspect-square";
  };

  const formatText = format === "story" ? "Story" : format === "reel" ? "Reel" : "Feed";

  if (isLoading) {
    return (
      <div className={`${getFormatClasses()} flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500`}>
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-xs">Generating image...</p>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className={`${getFormatClasses()} flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500`}>
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-xs">Uploading image...</p>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className={`${getFormatClasses()} flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500`}>
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <div className="rounded-full bg-red-100 p-2 text-red-600">
            <ImagePlus className="h-6 w-6" />
          </div>
          <p className="text-xs text-red-600">Image could not be loaded</p>
          {onGenerateImage && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateImage}
              className="mt-2"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${getFormatClasses()} flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500`}>
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2">
          <ImagePlus className="h-6 w-6" />
        </div>
        <p className="text-xs">Instagram {formatText} Image</p>
        <div className="flex flex-col gap-2 w-full mt-2">
          {onGenerateImage && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateImage}
              className="text-xs"
            >
              Generate with AI
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={triggerFileUpload}
            className="text-xs"
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;

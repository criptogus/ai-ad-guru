
import React from "react";
import { Image, Loader2, Upload, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 transition-all duration-300">
      {isLoading || isUploading ? (
        <div className="flex flex-col items-center animate-pulse">
          <div className="relative">
            <Loader2 className="h-6 w-6 animate-spin mb-2 text-blue-500" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {isUploading ? "Uploading image..." : "Creating professional ad image..."}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 max-w-xs">
            {isUploading 
              ? "Your image is being processed..." 
              : "Generating a photorealistic image optimized for Instagram ads"}
          </p>
          <div className="mt-3 w-full max-w-[120px]">
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-blue-500 animate-progress-indeterminate" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={cn(
            "mb-3 p-2 rounded-full transition-all duration-300",
            imageError 
              ? "bg-red-50 dark:bg-red-900/20" 
              : "bg-blue-50 dark:bg-blue-900/20"
          )}>
            {imageError ? (
              <AlertCircle size={32} className="text-red-500 dark:text-red-400" />
            ) : (
              <Image size={32} className="text-blue-500 dark:text-blue-400" />
            )}
          </div>
          
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {imageError ? "Image Generation Failed" : "Instagram Ad Image"}
          </h3>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3 max-w-xs">
            {imageError 
              ? "There was a problem generating your image. Please try again." 
              : "Create a photorealistic image optimized for Instagram ads with high engagement"}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {onGenerateImage && (
              <Button 
                variant="default"
                size="sm"
                className={cn(
                  "px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1",
                  imageError ? "bg-red-600 hover:bg-red-700" : "bg-blue-600"
                )}
                onClick={onGenerateImage}
                disabled={isLoading || isUploading}
              >
                {imageError ? (
                  <RefreshCw size={14} className="mr-1 animate-pulse" />
                ) : (
                  <Sparkles size={14} className="mr-1" />
                )}
                {imageError ? "Try Again" : "Generate AI Image"}
                <span className="ml-1 text-xs opacity-80">(5 credits)</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm rounded flex items-center gap-1 border-gray-300 dark:border-gray-600"
              onClick={triggerFileUpload}
              disabled={isLoading || isUploading}
            >
              <Upload size={14} />
              Upload Image
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 max-w-xs text-center">
            <p>Images will be photorealistic with high engagement potential</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;

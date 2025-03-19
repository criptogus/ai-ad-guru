
import React from "react";
import { Image, Loader2, Upload, Sparkles } from "lucide-react";
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
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50">
      {isLoading || isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin mb-2 text-blue-500" />
          <span className="text-sm text-gray-600 font-medium">
            {isUploading ? "Uploading image..." : "Creating professional ad image..."}
          </span>
          <p className="text-xs text-gray-500 text-center mt-1 max-w-xs">
            Generating a photorealistic image optimized for Instagram ads
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 p-2 bg-blue-50 rounded-full">
            <Image size={32} className="text-blue-500" />
          </div>
          
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            {imageError ? "Image Generation Failed" : "Instagram Ad Image"}
          </h3>
          
          <p className="text-xs text-gray-500 text-center mb-3 max-w-xs">
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
                <Sparkles size={14} className="mr-1" />
                {imageError ? "Try Again" : "Generate AI Image"}
                <span className="ml-1 text-xs opacity-80">(5 credits)</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm rounded flex items-center gap-1 border-gray-300"
              onClick={triggerFileUpload}
              disabled={isLoading || isUploading}
            >
              <Upload size={14} />
              Upload Image
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-gray-400 max-w-xs text-center">
            <p>Images will be photorealistic with high engagement potential</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;


import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload, Loader2 } from "lucide-react";

interface ImagePlaceholderProps {
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload?: () => void;
  isLoading: boolean;
  isUploading: boolean;
  imageError: boolean;
  format?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  onGenerateImage,
  triggerFileUpload,
  isLoading,
  isUploading,
  imageError,
  format = "feed"
}) => {
  if (isLoading || isUploading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          {isLoading ? "Generating image..." : "Uploading image..."}
        </p>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="text-sm text-red-500 mb-2">
          There was an error with the image
        </p>
        <div className="flex flex-row gap-2">
          {onGenerateImage && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateImage}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Image className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 mb-3">No image yet</p>
      <div className="flex flex-col space-y-2 items-center">
        {onGenerateImage && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onGenerateImage}
          >
            <Image className="h-4 w-4 mr-2" />
            Generate Image
          </Button>
        )}
        {triggerFileUpload && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={triggerFileUpload}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImagePlaceholder;

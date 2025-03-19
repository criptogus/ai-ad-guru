
import React from "react";
import { Image, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <Image size={40} className="text-gray-400 mb-2" />
      {isLoading || isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-4 w-4 animate-spin mb-1" />
          <span className="text-sm text-gray-500">
            {isUploading ? "Uploading image..." : "Generating image..."}
          </span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 text-center mb-2">
            {imageError ? "Failed to load image" : "No image generated yet"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {onGenerateImage && (
              <Button 
                variant="default"
                size="sm"
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={onGenerateImage}
                disabled={isLoading || isUploading}
              >
                {imageError ? "Try Again" : "Generate Image"}
                <span className="ml-1 text-xs">(5 credits)</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm rounded flex items-center gap-1"
              onClick={triggerFileUpload}
              disabled={isLoading || isUploading}
            >
              <Upload size={14} />
              Upload Image
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;


import React from "react";
import { Loader2 } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { cn } from "@/lib/utils";

interface ImageContentProps {
  ad: MetaAd;
  imageKey?: number;
  isLoading?: boolean;
  isUploading?: boolean;
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload?: () => void;
  format?: "feed" | "story" | "reel";
  onTemplateSelect?: (templateId: any) => void;
  className?: string;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey = 0,
  isLoading = false,
  isUploading = false,
  onGenerateImage,
  triggerFileUpload,
  format = "feed",
  onTemplateSelect,
  className
}) => {
  const handleGenerateClick = async () => {
    if (onGenerateImage) {
      await onGenerateImage();
    }
  };

  const imageContainerClasses = cn(
    "relative overflow-hidden flex items-center justify-center bg-gray-100",
    format === "feed" && "aspect-square",
    format === "story" && "aspect-[9/16]", 
    format === "reel" && "aspect-[9/16]",
    className
  );

  const renderImageContent = () => {
    if (isLoading || isUploading) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">
            {isLoading ? "Generating image..." : "Uploading image..."}
          </p>
        </div>
      );
    }

    if (ad.imageUrl) {
      return (
        <img
          src={ad.imageUrl}
          alt="Instagram content"
          className="w-full h-full object-cover"
          key={`ad-image-${imageKey}-${ad.imageUrl}`}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm text-gray-500 mb-2">No image available</p>
        {(onGenerateImage || triggerFileUpload) && (
          <div className="space-x-2">
            {onGenerateImage && (
              <button
                onClick={handleGenerateClick}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Generate
              </button>
            )}
            {triggerFileUpload && (
              <button
                onClick={triggerFileUpload}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Upload
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={imageContainerClasses}>
      {renderImageContent()}
    </div>
  );
};

export default ImageContent;

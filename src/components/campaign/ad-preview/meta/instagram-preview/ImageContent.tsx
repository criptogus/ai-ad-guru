
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import ImageDisplay from "./ImageDisplay";
import ImagePlaceholder from "./ImagePlaceholder";
import ImageLoader from "./ImageLoader";

interface ImageContentProps {
  ad: MetaAd;
  imageKey: number;
  isLoading: boolean;
  isUploading: boolean;
  format: "feed" | "story" | "reel";
  onGenerateImage?: () => void;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey,
  isLoading,
  isUploading,
  format,
  onGenerateImage,
}) => {
  // Determine the aspect ratio based on the format
  const getAspectRatio = () => {
    if (format === "story" || format === "reel") {
      return "9/16"; // Vertical format
    }
    return "1/1"; // Square format for feed
  };

  // Get container class based on format
  const getContainerClass = () => {
    if (format === "story" || format === "reel") {
      return "h-[400px]";
    }
    return "aspect-square";
  };

  return (
    <div className={`relative ${getContainerClass()} bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
      {isLoading ? (
        // Loading state
        <ImageLoader format={format} />
      ) : ad.imageUrl ? (
        // Image display when we have an imageUrl
        <ImageDisplay 
          imageUrl={ad.imageUrl} 
          altText={ad.headline || "Instagram ad"} 
          format={format} 
        />
      ) : (
        // Placeholder when no image is available
        <ImagePlaceholder 
          format={format}
          prompt={ad.imagePrompt}
          onGenerateImage={onGenerateImage}
        />
      )}
    </div>
  );
};

export default ImageContent;

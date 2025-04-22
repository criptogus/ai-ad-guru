
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import ImageLoader from "./ImageLoader";
import ImageDisplay from "./ImageDisplay";
import ImagePlaceholder from "./ImagePlaceholder";

interface ImageContentProps {
  ad: MetaAd;
  imageKey?: number;
  isLoading?: boolean;
  isUploading?: boolean;
  format: "feed" | "story" | "reel";
  onGenerateImage?: () => Promise<void>;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey = 0,
  isLoading = false,
  isUploading = false,
  format = "feed",
  onGenerateImage = async () => {},
}) => {
  const { imageUrl, imagePrompt } = ad;
  
  // Construct alt text from ad data
  const altText = imagePrompt || ad.primaryText?.split("\n")[0] || "Instagram Ad Image";
  
  // Loading state
  if (isLoading || isUploading) {
    return <ImageLoader format={format} />;
  }
  
  // Image exists
  if (imageUrl) {
    return (
      <ImageDisplay
        imageUrl={imageUrl}
        altText={altText}
        onGenerateImage={onGenerateImage}
        imagePrompt={imagePrompt}
        format={format}
      />
    );
  }
  
  // No image yet
  return (
    <ImagePlaceholder
      hasPrompt={!!imagePrompt}
      onGenerateImage={onGenerateImage}
      text={imagePrompt ? "Generate image" : "No image prompt available"}
    />
  );
};

export default ImageContent;

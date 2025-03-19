
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import ImagePlaceholder from "./ImagePlaceholder";

interface ImageContentProps {
  ad: MetaAd;
  imageKey?: number;
  isLoading: boolean;
  isUploading: boolean;
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload: () => void;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey,
  isLoading,
  isUploading,
  onGenerateImage,
  triggerFileUpload
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Force image refresh when URL changes by using a key
  const imageDisplay = ad.imageUrl && !imageError ? (
    <img 
      key={`${imageKey}-${ad.imageUrl}`}
      src={ad.imageUrl} 
      alt={ad.headline}
      className="w-full h-full object-cover"
      onError={(e) => {
        console.error("Image failed to load:", ad.imageUrl);
        setImageError(true);
      }}
    />
  ) : (
    <ImagePlaceholder 
      isLoading={isLoading}
      isUploading={isUploading}
      imageError={imageError}
      onGenerateImage={onGenerateImage}
      triggerFileUpload={triggerFileUpload}
    />
  );

  return (
    <div className="bg-gray-100 aspect-square relative">
      {imageDisplay}
    </div>
  );
};

export default ImageContent;

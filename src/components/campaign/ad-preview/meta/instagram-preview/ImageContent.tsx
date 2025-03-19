
import React, { useState, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import ImagePlaceholder from "./ImagePlaceholder";
import { cn } from "@/lib/utils";

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
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Reset error state when the image URL changes
  useEffect(() => {
    if (ad.imageUrl) {
      console.log("New image URL detected:", ad.imageUrl);
      setImageError(false);
      setIsImageLoaded(false);
    }
  }, [ad.imageUrl]);
  
  // Force image refresh when URL changes by using a unique key
  const uniqueKey = `${imageKey || 0}-${ad.imageUrl || 'placeholder'}-${Date.now()}`;
  
  const handleImageLoad = () => {
    console.log("Image loaded successfully:", ad.imageUrl);
    setIsImageLoaded(true);
  };
  
  const handleImageError = () => {
    console.error("Image failed to load:", ad.imageUrl);
    setImageError(true);
    setIsImageLoaded(false);
  };
  
  const imageDisplay = ad.imageUrl && !imageError ? (
    <div className="w-full h-full relative">
      {!isImageLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>}
      <img 
        key={uniqueKey}
        src={ad.imageUrl} 
        alt={ad.headline || "Instagram ad"}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isImageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
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
    <div className="bg-gray-100 aspect-square relative overflow-hidden">
      {imageDisplay}
      {/* Debug info */}
      {ad.imageUrl && <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-50 text-xs text-white">
        <div className="truncate">Image URL: {ad.imageUrl ? (ad.imageUrl.length > 30 ? ad.imageUrl.substring(0, 30) + '...' : ad.imageUrl) : 'None'}</div>
      </div>}
    </div>
  );
};

export default ImageContent;

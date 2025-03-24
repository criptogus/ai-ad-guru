
import React, { useState, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import ImagePlaceholder from "./ImagePlaceholder";
import ImageLoader from "./ImageLoader";
import { AlertCircle } from "lucide-react";

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
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Reset error state and set up image source when the image URL changes
  useEffect(() => {
    if (ad.imageUrl) {
      setImageError(false);
      setIsImageLoaded(false);
      setRetryCount(0);
      
      // Add cache buster to URL
      const cacheBuster = `t=${Date.now()}`;
      const newSrc = ad.imageUrl.includes('?') 
        ? `${ad.imageUrl}&${cacheBuster}` 
        : `${ad.imageUrl}?${cacheBuster}`;
      
      setImageSrc(newSrc);
    } else {
      setImageSrc(null);
    }
  }, [ad.imageUrl]);
  
  // Handle image load success
  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setImageError(false);
  };
  
  // Handle image load failure with retry logic
  const handleImageError = () => {
    console.error("Image failed to load:", imageSrc);
    
    // Retry logic with exponential backoff
    if (retryCount < 3 && ad.imageUrl) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      
      const delay = Math.pow(2, nextRetry) * 1000; // Exponential backoff
      
      setTimeout(() => {
        const withoutQuery = ad.imageUrl!.split('?')[0];
        const newSrc = `${withoutQuery}?nocache=${Date.now()}-retry-${nextRetry}`;
        setImageSrc(newSrc);
      }, delay);
    } else {
      setImageError(true);
      setIsImageLoaded(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 aspect-square relative overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {imageError && !isLoading && !isUploading && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-1.5 rounded-full">
            <AlertCircle size={16} />
          </div>
        </div>
      )}
      
      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={ad.headline || "Instagram ad"}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <ImagePlaceholder 
          isLoading={isLoading}
          isUploading={isUploading}
          imageError={imageError}
          onGenerateImage={onGenerateImage}
          triggerFileUpload={triggerFileUpload}
        />
      )}
    </div>
  );
};

export default ImageContent;

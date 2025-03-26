
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
  format?: string;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey,
  isLoading,
  isUploading,
  onGenerateImage,
  triggerFileUpload,
  format = "feed"
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

  // Determine aspect ratio class based on format
  const getAspectRatioClass = () => {
    if (format === "story" || format === "reel" || ad.format === "story" || ad.format === "reel") {
      return "aspect-[9/16]";
    }
    return "aspect-square";
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 ${getAspectRatioClass()} relative overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700`}>
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
          format={format || ad.format}
        />
      )}
      
      {process.env.NODE_ENV !== 'production' && (
        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-50 text-xs text-white">
          <div className="truncate">
            URL: {ad.imageUrl ? (ad.imageUrl.length > 30 ? ad.imageUrl.substring(0, 30) + '...' : ad.imageUrl) : 'None'}
          </div>
          <div className="flex justify-between">
            <span>Status: {isImageLoaded ? 'Loaded' : imageError ? 'Error' : 'Loading'}</span>
            <span>Retries: {retryCount}/3</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageContent;

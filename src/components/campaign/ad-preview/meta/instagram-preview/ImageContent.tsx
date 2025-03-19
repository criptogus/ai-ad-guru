
import React, { useState, useEffect, useRef } from "react";
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
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Reset error state and set up image source when the image URL changes
  useEffect(() => {
    if (ad.imageUrl) {
      console.log("ImageContent - New image URL detected:", ad.imageUrl);
      setImageError(false);
      setIsImageLoaded(false);
      setRetryCount(0);
      
      // Add cache buster to URL
      const cacheBuster = `t=${Date.now()}`;
      const newSrc = ad.imageUrl.includes('?') 
        ? `${ad.imageUrl}&${cacheBuster}` 
        : `${ad.imageUrl}?${cacheBuster}`;
      
      console.log("Setting image src to:", newSrc);
      setImageSrc(newSrc);
      
      // Preload the image
      const preloadImage = new Image();
      preloadImage.src = newSrc;
      console.log("Preloading and validating generated image:", newSrc);
      
      preloadImage.onload = () => {
        console.log("Generated image preloaded successfully");
      };
      
      preloadImage.onerror = (e) => {
        console.error("Error preloading image:", e);
      };
    } else {
      setImageSrc(null);
    }
  }, [ad.imageUrl]);
  
  // Debug output to track component state
  useEffect(() => {
    console.log("ImageContent rendering with:", {
      hasImageUrl: !!ad.imageUrl,
      imageUrl: ad.imageUrl,
      imageSrc,
      imageError,
      isImageLoaded,
      imageKey,
      retryCount
    });
  }, [ad.imageUrl, imageSrc, imageError, isImageLoaded, imageKey, retryCount]);
  
  const handleImageLoad = () => {
    console.log("The generated image URL loaded successfully");
    setIsImageLoaded(true);
    setImageError(false);
  };
  
  const handleImageError = () => {
    console.error("Image failed to load:", imageSrc);
    
    // Retry logic with exponential backoff
    if (retryCount < 3 && ad.imageUrl) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      
      const delay = Math.pow(2, nextRetry) * 1000; // Exponential backoff
      console.log(`Retrying image load (attempt ${nextRetry}) after ${delay}ms`);
      
      setTimeout(() => {
        if (imgRef.current) {
          const withoutQuery = ad.imageUrl!.split('?')[0];
          const newSrc = `${withoutQuery}?nocache=${Date.now()}-retry-${nextRetry}`;
          console.log("Retrying with new src:", newSrc);
          setImageSrc(newSrc);
        }
      }, delay);
    } else {
      setImageError(true);
      setIsImageLoaded(false);
    }
  };

  const imageDisplay = imageSrc && !imageError ? (
    <div className="w-full h-full relative">
      {!isImageLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>}
      <img 
        ref={imgRef}
        key={`img-${imageKey || 0}-${retryCount}`}
        src={imageSrc}
        alt={ad.headline || "Instagram ad"}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isImageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous"
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
      
      {/* Debug info - only visible in development */}
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

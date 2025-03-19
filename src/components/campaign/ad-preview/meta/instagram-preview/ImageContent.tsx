
import React, { useState, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import ImagePlaceholder from "./ImagePlaceholder";
import ImageDisplay from "./ImageDisplay";
import DebugInfo from "./DebugInfo";

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
        // Don't set an error, just log it
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
        const withoutQuery = ad.imageUrl!.split('?')[0];
        const newSrc = `${withoutQuery}?nocache=${Date.now()}-retry-${nextRetry}`;
        console.log("Retrying with new src:", newSrc);
        setImageSrc(newSrc);
      }, delay);
    } else {
      setImageError(true);
      setIsImageLoaded(false);
    }
  };

  return (
    <div className="bg-gray-100 aspect-square relative overflow-hidden">
      {imageSrc && !imageError ? (
        <ImageDisplay 
          imageSrc={imageSrc}
          altText={ad.headline || "Instagram ad"}
          imageKey={imageKey}
          retryCount={retryCount}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
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
      
      <DebugInfo 
        imageUrl={ad.imageUrl}
        isImageLoaded={isImageLoaded}
        imageError={imageError}
        retryCount={retryCount}
      />
    </div>
  );
};

export default ImageContent;

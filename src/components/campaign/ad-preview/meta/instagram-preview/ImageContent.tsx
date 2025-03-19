
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
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Reset error state when the image URL changes
  useEffect(() => {
    if (ad.imageUrl) {
      console.log("ImageContent - New image URL detected:", ad.imageUrl);
      setImageError(false);
      setIsImageLoaded(false);
      
      // Force image reload by adding cache buster if not already present
      if (imgRef.current) {
        const currentSrc = imgRef.current.src;
        if (!currentSrc.includes('?t=')) {
          imgRef.current.src = `${ad.imageUrl}?t=${Date.now()}`;
        }
      }
    }
  }, [ad.imageUrl]);
  
  // Debug output to track component state
  useEffect(() => {
    console.log("ImageContent rendering with:", {
      hasImageUrl: !!ad.imageUrl,
      imageUrl: ad.imageUrl,
      imageError,
      isImageLoaded,
      imageKey
    });
  }, [ad.imageUrl, imageError, isImageLoaded, imageKey]);
  
  // Force image refresh when URL changes by using a unique key
  const uniqueKey = `${imageKey || 0}-${ad.imageUrl || 'placeholder'}-${Date.now()}`;
  
  const handleImageLoad = () => {
    console.log("Image loaded successfully:", ad.imageUrl);
    setIsImageLoaded(true);
    setImageError(false);
  };
  
  const handleImageError = () => {
    console.error("Image failed to load:", ad.imageUrl);
    setImageError(true);
    setIsImageLoaded(false);
    
    // Try to reload with cache buster
    if (imgRef.current && ad.imageUrl) {
      const withoutQuery = ad.imageUrl.split('?')[0];
      const newSrc = `${withoutQuery}?nocache=${Date.now()}`;
      console.log("Retrying with cache buster:", newSrc);
      setTimeout(() => {
        if (imgRef.current) imgRef.current.src = newSrc;
      }, 1000);
    }
  };

  // Preload image
  useEffect(() => {
    if (ad.imageUrl) {
      const preloadImage = new Image();
      
      preloadImage.onload = () => {
        console.log("Image preloaded successfully:", ad.imageUrl);
      };
      
      preloadImage.onerror = (e) => {
        console.error("Image preload failed:", ad.imageUrl, e);
      };
      
      // Add cache buster
      const cacheBuster = `?t=${Date.now()}`;
      preloadImage.src = ad.imageUrl.includes('?') ? ad.imageUrl : ad.imageUrl + cacheBuster;
    }
  }, [ad.imageUrl]);
  
  const imageDisplay = ad.imageUrl && !imageError ? (
    <div className="w-full h-full relative">
      {!isImageLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>}
      <img 
        ref={imgRef}
        key={uniqueKey}
        src={ad.imageUrl.includes('?') ? ad.imageUrl : `${ad.imageUrl}?t=${Date.now()}`}
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
      {process.env.NODE_ENV !== 'production' && ad.imageUrl && (
        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-50 text-xs text-white">
          <div className="truncate">
            URL: {ad.imageUrl ? (ad.imageUrl.length > 30 ? ad.imageUrl.substring(0, 30) + '...' : ad.imageUrl) : 'None'}
          </div>
          <div className="truncate">
            Status: {isImageLoaded ? 'Loaded' : imageError ? 'Error' : 'Loading'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageContent;

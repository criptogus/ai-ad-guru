
import React, { useState, useEffect } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "./ImagePlaceholder";

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
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imgSrc, setImgSrc] = useState<string | null>(ad.imageUrl || null);

  // Reset error state and retry count when ad.imageUrl changes
  useEffect(() => {
    if (ad.imageUrl) {
      console.log("ImageContent: Setting new image URL", ad.imageUrl);
      setImageError(false);
      setRetryCount(0);
      
      // Add cache-busting parameter to prevent stale cache issues
      const cacheBuster = `?t=${new Date().getTime()}`;
      const newUrl = ad.imageUrl.includes('?') 
        ? `${ad.imageUrl}&cb=${cacheBuster}` 
        : `${ad.imageUrl}${cacheBuster}`;
      
      setImgSrc(newUrl);
    } else {
      setImgSrc(null);
    }
  }, [ad.imageUrl]);

  const handleGenerateClick = async () => {
    if (onGenerateImage) {
      console.log("ImageContent: Triggering image generation");
      setImageError(false);
      await onGenerateImage();
    }
  };

  // Enhanced error handling with better fallback mechanism
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", imgSrc);
    
    // Try to reload the image a couple of times with a new cache-buster
    if (retryCount < 2 && ad.imageUrl) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      
      // Add a delay before retrying to give servers time to recover
      setTimeout(() => {
        const newUrl = `${ad.imageUrl}?retry=${nextRetry}&t=${new Date().getTime()}`;
        console.log(`Retrying image load (attempt ${nextRetry}):`, newUrl);
        setImgSrc(newUrl);
      }, 1000 * nextRetry); // Increase delay with each retry
    } else {
      // After retry attempts, show error state
      setImageError(true);
      
      // Create a simple SVG fallback directly as data URL
      const fallbackSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#f0f0f0"/>
          <text x="50" y="50" font-family="Arial" font-size="8" fill="#666666" text-anchor="middle" dominant-baseline="middle">Image Unavailable</text>
        </svg>
      `);
      e.currentTarget.src = `data:image/svg+xml,${fallbackSvg}`;
      e.currentTarget.setAttribute('data-load-failed', 'true');
      
      console.log("All retry attempts failed for image:", ad.imageUrl);
    }
  };

  const imageContainerClasses = cn(
    "relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800",
    format === "feed" && "aspect-square",
    format === "story" && "aspect-[9/16]", 
    format === "reel" && "aspect-[9/16]",
    className
  );

  // Show loading state
  if (isLoading || isUploading) {
    return (
      <div className={imageContainerClasses}>
        <div className="flex flex-col items-center justify-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">
            {isLoading ? "Generating image..." : "Uploading image..."}
          </p>
        </div>
      </div>
    );
  }

  // Show the image if available
  if (imgSrc) {
    return (
      <div className={imageContainerClasses}>
        <img
          src={imgSrc}
          alt="Instagram content"
          className="w-full h-full object-cover"
          key={`ad-image-${imageKey}-${retryCount}`}
          onError={handleImageError}
          loading="eager"
        />
        
        {imageError && onGenerateImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateClick}
              className="bg-white text-gray-800"
            >
              Regenerate image
            </Button>
          </div>
        )}
        
        {!imageError && onGenerateImage && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateClick}
              className="bg-black/70 text-white border-white/20"
            >
              Regenerate image
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show placeholder if no image is available
  return (
    <div className={imageContainerClasses} onClick={handleGenerateClick}>
      <ImagePlaceholder 
        onGenerateImage={onGenerateImage}
        triggerFileUpload={triggerFileUpload}
        format={format}
        imageError={imageError}
      />
    </div>
  );
};

export default ImageContent;

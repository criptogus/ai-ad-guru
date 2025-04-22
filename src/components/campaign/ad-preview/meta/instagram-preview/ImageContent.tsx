
import React, { useState, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Loader2, Image, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdTemplate } from "../../template-gallery/TemplateGallery";

interface ImageContentProps {
  ad: MetaAd;
  imageKey: number;
  isLoading: boolean;
  isUploading: boolean;
  format: 'feed' | 'story' | 'reel';
  onGenerateImage?: () => void;
  triggerFileUpload?: () => void;
  onTemplateSelect?: (template: AdTemplate) => void;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey,
  isLoading,
  isUploading,
  format,
  onGenerateImage,
  triggerFileUpload
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Reset error state when a new image URL is provided
  useEffect(() => {
    if (ad.imageUrl) {
      setImageError(false);
      setIsImageLoaded(false);
      setRetryCount(0);
    }
  }, [ad.imageUrl]);

  // Define container class based on format
  const containerClass = format === 'story' || format === 'reel'
    ? "aspect-[9/16] w-full h-[400px]"
    : "aspect-square w-full";

  // Handle image load errors
  const handleImageError = () => {
    console.error("Image failed to load:", ad.imageUrl);
    
    // Retry logic with exponential backoff
    if (retryCount < 3 && ad.imageUrl) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      
      setTimeout(() => {
        // Force a reload by appending a timestamp to the URL
        const timestamp = new Date().getTime();
        const refreshImage = document.getElementById(`ad-image-${imageKey}`) as HTMLImageElement;
        if (refreshImage) {
          const url = ad.imageUrl?.includes('?') 
            ? `${ad.imageUrl}&t=${timestamp}` 
            : `${ad.imageUrl}?t=${timestamp}`;
          refreshImage.src = url;
        }
      }, Math.pow(2, nextRetry) * 1000); // Exponential backoff
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`${containerClass} relative overflow-hidden bg-gray-100 dark:bg-gray-800`}>
      {/* Image display */}
      {ad.imageUrl ? (
        <>
          <img
            id={`ad-image-${imageKey}`}
            src={ad.imageUrl + (ad.imageUrl.includes('?') ? '&' : '?') + `cache=${Date.now()}`}
            alt={ad.headline || "Ad image"}
            className="w-full h-full object-cover"
            onLoad={() => {
              setIsImageLoaded(true);
              setImageError(false);
            }}
            onError={handleImageError}
          />
          
          {/* Error overlay with retry button */}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90">
              <p className="text-sm text-red-500 mb-2">Failed to load image</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onGenerateImage}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Regenerate
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Generating image...</p>
            </div>
          ) : isUploading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-3 inline-block mb-3">
                <Image className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">No image yet</p>
              {onGenerateImage && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onGenerateImage}
                  className="mr-2"
                >
                  Generate AI Image
                </Button>
              )}
              {triggerFileUpload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={triggerFileUpload}
                >
                  Upload Image
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageContent;

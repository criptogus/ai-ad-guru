
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image, RefreshCw } from "lucide-react";

interface ImageDisplayProps {
  imageUrl: string;
  alt?: string;
  isLoading?: boolean;
  onGenerateImage?: () => Promise<void>;
  imagePrompt?: string;
  format?: "feed" | "story" | "reel";
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  alt = "Instagram ad image",
  isLoading = false,
  onGenerateImage,
  imagePrompt,
  format = "feed"
}) => {
  const handleGenerateImage = async () => {
    if (onGenerateImage) {
      console.log("Starting image generation with prompt:", imagePrompt);
      await onGenerateImage();
    }
  };

  // Improved error handling with inline SVG fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", imageUrl);
    
    // Create an inline SVG as fallback instead of using external placeholder service
    const fallbackColor = "#f0f0f0";
    const textColor = "#666666";
    const fallbackSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${fallbackColor}"/>
        <text x="50" y="50" font-family="Arial" font-size="8" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">Image Unavailable</text>
      </svg>
    `;
    const encodedSvg = encodeURIComponent(fallbackSvg);
    e.currentTarget.src = `data:image/svg+xml,${encodedSvg}`;
    
    // Mark the image as failed for potential logic
    e.currentTarget.setAttribute('data-load-failed', 'true');
  };

  // Apply different aspect ratios based on format
  const aspectRatioClass = format === "feed" 
    ? "aspect-square" 
    : "aspect-[9/16]";

  return (
    <div className={`relative w-full ${aspectRatioClass} bg-muted/30`}>
      {imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="eager"
          />
          {onGenerateImage && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateImage}
                disabled={isLoading}
                className="bg-black/70 text-white border-white/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4">
          {isLoading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Generating image...
              </p>
            </>
          ) : (
            <>
              <Image className="w-12 h-12 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center mb-4">
                {imagePrompt ? "Click to generate image" : "No image available"}
              </p>
              {imagePrompt && onGenerateImage && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleGenerateImage}
                >
                  Generate Image
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;

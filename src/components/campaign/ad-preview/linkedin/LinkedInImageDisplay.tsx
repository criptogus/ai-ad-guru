
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkedInImageDisplayProps {
  imageUrl: string | undefined;
  isGeneratingImage: boolean;
  onGenerateImage?: () => Promise<void>;
  imageFormat?: string;
}

const LinkedInImageDisplay: React.FC<LinkedInImageDisplayProps> = ({
  imageUrl,
  isGeneratingImage,
  onGenerateImage,
  imageFormat = "square"
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error("LinkedIn ad image failed to load:", imageUrl);
    setImageError(true);
    setIsImageLoaded(false);
  };

  // Determine aspect ratio class based on format
  const aspectRatioClass = imageFormat === "landscape" 
    ? "aspect-[1200/627]" 
    : "aspect-square";

  return (
    <div className={cn("relative overflow-hidden bg-gray-100 rounded-md", aspectRatioClass)}>
      {imageUrl && !imageError ? (
        <>
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
          <img
            src={imageUrl}
            alt="LinkedIn Ad"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center p-4">
          {isGeneratingImage ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-500 mt-2">Generating professional LinkedIn image...</p>
            </>
          ) : (
            <>
              <div className="bg-gray-200 rounded-full p-3">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {imageError ? "Image failed to load" : "No image generated yet"}
              </p>
              {onGenerateImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerateImage}
                  className="mt-3"
                >
                  {imageError ? "Retry" : "Generate Image"}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInImageDisplay;

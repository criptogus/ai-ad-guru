
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image, RefreshCw } from "lucide-react";

interface ImageDisplayProps {
  imageUrl: string;
  alt?: string;
  isLoading?: boolean;
  onGenerateImage?: () => Promise<void>;
  imagePrompt?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  alt = "Instagram ad image",
  isLoading = false,
  onGenerateImage,
  imagePrompt
}) => {
  const handleGenerateImage = async () => {
    if (onGenerateImage) {
      await onGenerateImage();
    }
  };

  return (
    <div className="relative w-full aspect-square bg-muted/30">
      {imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover"
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

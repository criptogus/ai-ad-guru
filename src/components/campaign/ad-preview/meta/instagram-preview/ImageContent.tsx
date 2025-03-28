
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageContentProps {
  ad: MetaAd;
  isLoading: boolean;
  onGenerateImage?: () => Promise<void>;
  format?: "feed" | "story" | "reel";
  // Add any other props used in the component
  imageKey?: number;
  isUploading?: boolean;
  triggerFileUpload?: () => void;
  onTemplateSelect?: (template: any) => void;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  isLoading,
  onGenerateImage,
  format = "feed",
  imageKey,
  isUploading,
  triggerFileUpload,
  onTemplateSelect
}) => {
  // Set the aspect ratio based on the format
  const getAspectRatio = () => {
    switch (format) {
      case "story":
      case "reel":
        return "aspect-[9/16]";
      default: // feed
        return "aspect-square";
    }
  };

  if (isLoading) {
    return (
      <div className={`${getAspectRatio()} flex items-center justify-center bg-muted`}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Generating image...</p>
        </div>
      </div>
    );
  }

  if (!ad.imageUrl) {
    return (
      <div className={`${getAspectRatio()} bg-muted flex flex-col items-center justify-center p-4`}>
        {onGenerateImage ? (
          <Button 
            variant="outline" 
            onClick={onGenerateImage}
            className="gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Generate Image
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              No image generated yet
            </p>
          </div>
        )}
      </div>
    );
  }

  // Error handling for broken images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Failed to load image:", ad.imageUrl);
    e.currentTarget.src = "https://placehold.co/600x600/eeeeee/999999?text=Image+Load+Failed";
  };

  return (
    <div className={`${getAspectRatio()} bg-muted overflow-hidden relative group`}>
      <img 
        src={ad.imageUrl} 
        alt={ad.headline || "Instagram ad"}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
      
      {/* Regenerate Button Overlay */}
      {onGenerateImage && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="outline" 
            onClick={onGenerateImage}
            className="bg-black/50 text-white border-white hover:bg-black/80"
          >
            Regenerate Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageContent;

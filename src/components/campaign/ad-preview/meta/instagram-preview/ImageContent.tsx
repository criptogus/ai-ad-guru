
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Loader2 } from "lucide-react";
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
  // Define container class based on format
  const containerClass = format === 'story' || format === 'reel'
    ? "aspect-[9/16] w-full h-[400px]"
    : "aspect-square w-full";

  return (
    <div className={`${containerClass} relative overflow-hidden`}>
      {/* Image display */}
      {ad.imageUrl ? (
        <img
          src={ad.imageUrl}
          alt={ad.headline || "Ad image"}
          className="w-full h-full object-cover"
          key={`image-${imageKey}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
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
              <p className="text-sm text-muted-foreground mb-3">No image available</p>
              {onGenerateImage && (
                <Button 
                  size="sm" 
                  onClick={onGenerateImage} 
                  className="mr-2"
                >
                  Generate AI Image
                </Button>
              )}
              {triggerFileUpload && (
                <Button 
                  size="sm" 
                  variant="outline" 
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

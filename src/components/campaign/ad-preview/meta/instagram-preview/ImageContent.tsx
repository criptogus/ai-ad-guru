
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Loader2, Image } from "lucide-react";
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
          key={`image-${imageKey}-${Date.now()}`} // Add timestamp to force refresh
          onError={(e) => {
            console.error("Image failed to load:", ad.imageUrl);
            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBmYWlsZWQgdG8gbG9hZDwvdGV4dD48L3N2Zz4=";
          }}
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
            <div className="text-center px-4">
              <Image className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              {ad.imagePrompt ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">Image prompt ready for generation</p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={onGenerateImage}
                  >
                    Generate Image
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">No image available</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={triggerFileUpload}
                    >
                      Upload Image
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Overlay for interactive controls when image is present */}
      {ad.imageUrl && !isLoading && !isUploading && (
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onGenerateImage}
            >
              Regenerate
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={triggerFileUpload}
            >
              Replace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageContent;

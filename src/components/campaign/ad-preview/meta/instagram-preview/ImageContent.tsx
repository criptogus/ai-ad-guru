
import React from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  const handleGenerateClick = async () => {
    if (onGenerateImage) {
      await onGenerateImage();
    }
  };

  // Enhanced error handling with multiple fallback options
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Erro ao carregar imagem:", ad.imageUrl);
    
    try {
      // Try a more reliable placeholder service with better compatibility
      e.currentTarget.src = "https://via.placeholder.com/600x600/f0f0f0/ff0000?text=Imagem+Indisponível";
      
      // Mark the image as failed for potential re-fetch logic
      e.currentTarget.setAttribute('data-load-failed', 'true');
    } catch (err) {
      console.error("Erro no fallback da imagem:", err);
      // Ultimate fallback - simple color
      e.currentTarget.style.backgroundColor = "#f0f0f0";
      e.currentTarget.style.display = "flex";
      e.currentTarget.style.alignItems = "center";
      e.currentTarget.style.justifyContent = "center";
    }
  };

  const imageContainerClasses = cn(
    "relative overflow-hidden flex items-center justify-center bg-gray-100",
    format === "feed" && "aspect-square",
    format === "story" && "aspect-[9/16]", 
    format === "reel" && "aspect-[9/16]",
    className
  );

  const renderImageContent = () => {
    if (isLoading || isUploading) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">
            {isLoading ? "Gerando imagem..." : "Fazendo upload da imagem..."}
          </p>
        </div>
      );
    }

    if (ad.imageUrl) {
      return (
        <div className="relative w-full h-full">
          <img
            src={ad.imageUrl}
            alt="Instagram content"
            className="w-full h-full object-cover"
            key={`ad-image-${imageKey}-${ad.imageUrl}`}
            onError={handleImageError}
            loading="eager"
          />
          
          {onGenerateImage && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateClick}
                className="bg-black/70 text-white border-white/20"
              >
                Regenerar imagem
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 mb-2">
          {ad.imagePrompt ? "Clique para gerar a imagem" : "Nenhuma imagem disponível"}
        </p>
        {(onGenerateImage || triggerFileUpload) && (
          <div className="space-x-2">
            {onGenerateImage && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateClick}
              >
                Gerar imagem
              </Button>
            )}
            {triggerFileUpload && (
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileUpload}
              >
                Upload
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={imageContainerClasses}>
      {renderImageContent()}
    </div>
  );
};

export default ImageContent;


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
      console.log("Iniciando geração de imagem com prompt:", imagePrompt);
      await onGenerateImage();
    }
  };

  // Enhanced error handling for broken images with robust fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Falha ao carregar imagem:", imageUrl);
    // Use a more reliable placeholder service with a clear error message
    e.currentTarget.src = "https://via.placeholder.com/600x600/f0f0f0/ff0000?text=Imagem+Indisponível";
    
    // Add a data attribute to track that this image failed to load
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
                    Gerando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerar
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
                Gerando imagem...
              </p>
            </>
          ) : (
            <>
              <Image className="w-12 h-12 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center mb-4">
                {imagePrompt ? "Clique para gerar imagem" : "Nenhuma imagem disponível"}
              </p>
              {imagePrompt && onGenerateImage && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleGenerateImage}
                >
                  Gerar Imagem
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


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/card";
import { Loader2, Image, RefreshCw } from "lucide-react";

interface ImageDisplayProps {
  imageUrl: string;
  altText?: string;
  alt?: string;
  isLoading?: boolean;
  onGenerateImage?: () => Promise<void>;
  imagePrompt?: string;
  format?: "feed" | "story" | "reel";
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  alt = "Imagem do anúncio do Instagram",
  altText, // New prop, used as fallback for alt
  isLoading = false,
  onGenerateImage,
  imagePrompt,
  format = "feed"
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(imageUrl || null);
  const [imgError, setImgError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Use altText if provided, otherwise fall back to alt
  const imageAlt = altText || alt;

  // Reset error state and set up image source when imageUrl changes
  useEffect(() => {
    if (!imageUrl) return;
    
    console.log("ImageDisplay: Setting up image with URL:", imageUrl);
    setImgError(false);
    setRetryCount(0);
    setIsImageLoading(true);
    
    // Add cache-busting parameter to prevent stale cache
    const cacheBuster = `cb=${Date.now()}`;
    const newSrc = imageUrl.includes('?') 
      ? `${imageUrl}&${cacheBuster}` 
      : `${imageUrl}?${cacheBuster}`;
    
    setImgSrc(newSrc);
  }, [imageUrl]);

  const handleImageLoad = () => {
    console.log("ImageDisplay: Image loaded successfully:", imgSrc);
    setIsImageLoading(false);
  };

  const handleGenerateImage = async () => {
    if (onGenerateImage) {
      console.log("Iniciando geração de imagem com prompt:", imagePrompt);
      setImgError(false);
      setIsImageLoading(true);
      await onGenerateImage();
    }
  };

  // Improved error handling with retry logic
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Falha ao carregar imagem:", imgSrc);
    
    // Try to reload the image a couple times with a new cache-buster
    if (retryCount < 2 && imageUrl) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      
      // Add a delay before retrying
      setTimeout(() => {
        const newUrl = `${imageUrl}?retry=${nextRetry}&t=${Date.now()}`;
        console.log(`Tentando recarregar imagem (tentativa ${nextRetry}):`, newUrl);
        setImgSrc(newUrl);
      }, 1000 * nextRetry); // Exponential backoff
    } else {
      // After retry attempts, set error state
      setImgError(true);
      setIsImageLoading(false);
      
      // Create an inline SVG as fallback
      const fallbackSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#f0f0f0"/>
          <text x="50" y="50" font-family="Arial" font-size="8" fill="#666666" text-anchor="middle" dominant-baseline="middle">Imagem Indisponível</text>
        </svg>
      `;
      const encodedSvg = encodeURIComponent(fallbackSvg);
      e.currentTarget.src = `data:image/svg+xml,${encodedSvg}`;
      
      console.log("Todas as tentativas de carregamento falharam para a imagem:", imageUrl);
    }
  };

  // Apply different aspect ratios based on format
  const aspectRatioClass = format === "feed" 
    ? "aspect-square" 
    : "aspect-[9/16]";

  // If no image URL is provided, show placeholder
  if (!imgSrc) {
    return (
      <div className={`relative w-full ${aspectRatioClass} bg-muted/30`}>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Image className="w-12 h-12 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center mb-4">
            Nenhuma imagem disponível
          </p>
        </div>
      </div>
    );
  }

  // Show image with error handling
  return (
    <div className={`relative w-full ${aspectRatioClass} bg-muted/30`}>
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      <div className="relative w-full h-full">
        <img
          src={imgSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="eager"
          style={{opacity: isImageLoading ? 0.5 : 1}}
        />
        
        {imgError && onGenerateImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Button
              onClick={handleGenerateImage}
              className="bg-white text-gray-800 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        )}
        
        {!imgError && onGenerateImage && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
            <Button
              onClick={handleGenerateImage}
              disabled={isLoading}
              className="bg-black/70 text-white border-white/20 hover:bg-black/60"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;

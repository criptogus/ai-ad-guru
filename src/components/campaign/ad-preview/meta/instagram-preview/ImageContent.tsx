
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import ImageLoader from "./ImageLoader";
import ImageDisplay from "./ImageDisplay";
import ImagePlaceholder from "./ImagePlaceholder";
import { toast } from "sonner";

interface ImageContentProps {
  ad: MetaAd;
  imageKey?: number;
  isLoading?: boolean;
  isUploading?: boolean;
  format: "feed" | "story" | "reel";
  onGenerateImage?: () => Promise<void>;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey = 0,
  isLoading = false,
  isUploading = false,
  format = "feed",
  onGenerateImage = async () => {},
}) => {
  const { imageUrl, imagePrompt } = ad;
  const [imgError, setImgError] = React.useState(false);
  
  // Debug logging
  React.useEffect(() => {
    console.log(`ImageContent [${imageKey}] Rendering:`, {
      hasImageUrl: !!imageUrl,
      imageUrl: imageUrl?.substring(0, 30) + "...",
      hasImagePrompt: !!imagePrompt,
      isLoading,
      isUploading,
      imgError
    });
  }, [ad, imageKey, imageUrl, imagePrompt, isLoading, isUploading, imgError]);
  
  // Constructs alternative text from ad data
  const altText = imagePrompt || ad.primaryText?.split("\n")[0] || "Imagem de Anúncio do Instagram";
  
  // Handle image error state
  const handleImageError = () => {
    console.error(`Image failed to load: ${imageUrl}`);
    setImgError(true);
    
    // This will trigger a new attempt to regenerate the image
    if (onGenerateImage && imagePrompt) {
      toast.error("Falha ao carregar imagem", {
        description: "Tentaremos gerar uma nova imagem automaticamente"
      });
      
      // Wait a short time before triggering regeneration
      setTimeout(() => {
        onGenerateImage().catch(err => {
          console.error("Failed to regenerate image:", err);
        });
      }, 1000);
    }
  };
  
  // State of loading
  if (isLoading || isUploading) {
    return <ImageLoader format={format} />;
  }
  
  // Image exists - stricter URL validation
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '' 
      && (imageUrl.startsWith('http') || imageUrl.startsWith('data:image'))) {
    console.log(`ImageContent [${imageKey}]: Displaying image with valid URL: ${imageUrl.substring(0, 30)}...`);
    
    if (imgError) {
      // If we already tried loading this URL and it failed, show placeholder
      return (
        <ImagePlaceholder
          hasPrompt={!!imagePrompt}
          onGenerateImage={onGenerateImage}
          text="Imagem anterior falhou. Clique para tentar novamente."
        />
      );
    }
    
    return (
      <ImageDisplay
        imageUrl={imageUrl}
        altText={altText}
        onGenerateImage={onGenerateImage}
        imagePrompt={imagePrompt}
        format={format}
        onError={handleImageError}
      />
    );
  }
  
  const handleGenerateClick = async () => {
    try {
      if (!imagePrompt) {
        toast.error("Não foi possível gerar imagem", {
          description: "Este anúncio não tem um prompt de imagem definido"
        });
        return;
      }
      
      console.log(`ImageContent [${imageKey}]: Iniciando geração de imagem`);
      console.log("Usando prompt:", imagePrompt);
      
      await onGenerateImage();
    } catch (error) {
      console.error(`ImageContent [${imageKey}]: Erro ao gerar imagem:`, error);
      toast.error("Falha na geração da imagem", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  };
  
  // No image yet
  return (
    <ImagePlaceholder
      hasPrompt={!!imagePrompt}
      onGenerateImage={handleGenerateClick}
      text={imagePrompt ? "Gerar imagem" : "Não há prompt de imagem disponível"}
    />
  );
};

export default ImageContent;

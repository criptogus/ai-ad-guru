
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
  
  // Log for debugging
  React.useEffect(() => {
    if (imageUrl) {
      console.log(`ImageContent: Image URL available for ad ${imageKey}:`, imageUrl);
    } else if (imagePrompt) {
      console.log(`ImageContent: No image URL, but prompt available for ad ${imageKey}`);
    }
  }, [imageUrl, imagePrompt, imageKey]);
  
  // Construct alt text from ad data
  const altText = imagePrompt || ad.primaryText?.split("\n")[0] || "Instagram Ad Image";
  
  // Loading state
  if (isLoading || isUploading) {
    return <ImageLoader format={format} />;
  }
  
  // Image exists
  if (imageUrl) {
    return (
      <ImageDisplay
        imageUrl={imageUrl}
        altText={altText}
        onGenerateImage={onGenerateImage}
        imagePrompt={imagePrompt}
        format={format}
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
      
      console.log("Iniciando geração de imagem para anúncio:", imageKey);
      await onGenerateImage();
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
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

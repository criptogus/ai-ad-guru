
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
  
  // Log para debugging mais detalhado
  React.useEffect(() => {
    console.log(`ImageContent: Anúncio [${imageKey}] recebido:`, JSON.stringify(ad, null, 2));
    if (imageUrl) {
      console.log(`ImageContent: URL da imagem disponível:`, imageUrl);
    } else if (imagePrompt) {
      console.log(`ImageContent: Prompt disponível, mas sem URL:`, imagePrompt);
    }
  }, [ad, imageKey, imageUrl, imagePrompt]);
  
  // Constrói texto alternativo a partir dos dados do anúncio
  const altText = imagePrompt || ad.primaryText?.split("\n")[0] || "Imagem de Anúncio do Instagram";
  
  // Estado de carregamento
  if (isLoading || isUploading) {
    return <ImageLoader format={format} />;
  }
  
  // Imagem existe - verificação mais rigorosa da URL
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
    console.log(`ImageContent: Renderizando imagem com URL válida: ${imageUrl}`);
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
      console.log("Usando prompt:", imagePrompt);
      
      await onGenerateImage();
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Falha na geração da imagem", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  };
  
  // Sem imagem ainda
  return (
    <ImagePlaceholder
      hasPrompt={!!imagePrompt}
      onGenerateImage={handleGenerateClick}
      text={imagePrompt ? "Gerar imagem" : "Não há prompt de imagem disponível"}
    />
  );
};

export default ImageContent;


import React, { useState, useRef, useEffect } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { AdTemplate } from "../../template-gallery/TemplateGallery";
import InstagramPreviewHeader from "./InstagramPreviewHeader";
import ImageContent from "./ImageContent";
import TextContent from "./TextContent";
import ActionBar from "./ActionBar";
import InstagramPreviewFooter from "./InstagramPreviewFooter";
import ImageUploadHandler from "./ImageUploadHandler";
import { toast } from "sonner";
import { normalizeMetaAd } from "@/lib/utils";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  index?: number;
  loadingImageIndex?: number | null;
  isLoading?: boolean;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  viewMode?: "feed" | "story" | "reel";
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  index = 0,
  loadingImageIndex = null,
  isLoading = false,
  onGenerateImage,
  onUpdateAd,
  viewMode = "feed"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isImageLoading = isLoading || loadingImageIndex === index;
  
  // Normalize the ad to ensure it has format and hashtags properties
  const normalizedAd = normalizeMetaAd(ad);
  
  // Track if we've made an initial image generation attempt
  useEffect(() => {
    if (!hasAttemptedLoad && !normalizedAd.imageUrl && onGenerateImage && normalizedAd.imagePrompt) {
      console.log("Auto-generating image for ad with prompt:", normalizedAd.imagePrompt);
      onGenerateImage().then(() => {
        setHasAttemptedLoad(true);
      });
    }
  }, [hasAttemptedLoad, normalizedAd.imageUrl, normalizedAd.imagePrompt, onGenerateImage]);

  // Ensure format is one of the allowed values
  const normalizeFormat = (format?: string): "feed" | "story" | "reel" => {
    if (format === "story" || format === "reel") {
      return format;
    }
    // Default to "feed" for any other value
    return "feed";
  };

  // Trigger file input dialog
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpdateAd) return;

    try {
      setIsUploading(true);
      
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      
      // Update the ad with the new image URL
      onUpdateAd({
        ...normalizedAd,
        imageUrl: localUrl
      });

      toast.success("Imagem carregada com sucesso");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Falha ao carregar imagem");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleTemplateSelect = (template: AdTemplate) => {
    if (!onUpdateAd) return;
    
    // Update the ad with the template information
    onUpdateAd({
      ...normalizedAd,
      imagePrompt: template.prompt
    });
    
    // Generate new image based on the template
    if (onGenerateImage) {
      toast.info(`Gerando imagem com template "${template.name}"`);
      onGenerateImage();
    }
  };

  // Generate image from prompt if one isn't already available
  const handleGenerateImage = async () => {
    if (onGenerateImage) {
      try {
        console.log("Generating image with prompt:", normalizedAd.imagePrompt);
        await onGenerateImage();
        setHasAttemptedLoad(true);
      } catch (error) {
        console.error("Error generating image:", error);
        toast.error("Falha ao gerar imagem");
      }
    }
  };

  // Determine which format to use (from props, ad, or default)
  const format = viewMode 
    ? viewMode 
    : normalizeFormat(normalizedAd.format);

  return (
    <div className="w-full max-w-sm mx-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900">
      <InstagramPreviewHeader companyName={companyName} />
      
      <ImageContent 
        ad={normalizedAd}
        imageKey={index}
        isLoading={isImageLoading}
        isUploading={isUploading}
        onGenerateImage={handleGenerateImage}
        triggerFileUpload={triggerFileUpload}
        format={format}
        onTemplateSelect={handleTemplateSelect}
      />
      
      <div className="p-3">
        <ActionBar />
        <TextContent 
          headline={normalizedAd.headline}
          primaryText={normalizedAd.primaryText}
          companyName={companyName}
        />
        <InstagramPreviewFooter ad={normalizedAd} companyName={companyName} />
      </div>
      
      <ImageUploadHandler 
        onChange={handleFileChange}
      />
      {fileInputRef && <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />}
    </div>
  );
};

export default InstagramPreview;

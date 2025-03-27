
import React, { useState, useRef } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { AdTemplate } from "../../template-gallery/TemplateGallery";
import InstagramPreviewHeader from "./InstagramPreviewHeader";
import ImageContent from "./ImageContent";
import TextContent from "./TextContent";
import ActionBar from "./ActionBar";
import InstagramPreviewFooter from "./InstagramPreviewFooter";
import ImageUploadHandler from "./ImageUploadHandler";
import { toast } from "sonner";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  index?: number;
  loadingImageIndex?: number | null;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  viewMode?: "feed" | "story" | "reel";
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  index = 0,
  loadingImageIndex = null,
  onGenerateImage,
  onUpdateAd,
  viewMode = "feed"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = loadingImageIndex === index;

  // Apply view mode styling
  const getPreviewClass = () => {
    switch (viewMode) {
      case "story":
        return "max-w-[250px] w-full";
      case "reel":
        return "max-w-[250px] w-full";
      default: // feed
        return "max-w-[330px] w-full";
    }
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
        ...ad,
        imageUrl: localUrl,
      });
      
      toast.success("Image uploaded successfully");

    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
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
      ...ad,
      imagePrompt: template.prompt,
      format: template.dimensions?.width === template.dimensions?.height ? "square" : 
              template.dimensions?.width > template.dimensions?.height ? "landscape" : "portrait"
    });
    
    // Generate new image based on the template
    if (onGenerateImage) {
      toast.info(`Generating image using "${template.name}" template`);
      onGenerateImage();
    }
  };

  // Determine container class based on view mode
  const containerClass = viewMode === "story" || viewMode === "reel"
    ? "border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900 aspect-[9/16]"
    : "border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900";

  return (
    <div className={`${getPreviewClass()} mx-auto ${containerClass}`}>
      <InstagramPreviewHeader companyName={companyName} format={viewMode} />
      
      <ImageContent 
        ad={ad}
        imageKey={index}
        isLoading={isLoading}
        isUploading={isUploading}
        onGenerateImage={onGenerateImage}
        triggerFileUpload={triggerFileUpload}
        format={viewMode === "story" ? "story" : viewMode === "reel" ? "reel" : "feed"}
        onTemplateSelect={handleTemplateSelect}
      />
      
      <div className="p-3">
        <ActionBar />
        <TextContent 
          headline={ad.headline}
          primaryText={ad.primaryText}
          companyName={companyName}
        />
        <InstagramPreviewFooter ad={ad} companyName={companyName} />
      </div>
      
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp" 
      />
    </div>
  );
};

export default InstagramPreview;

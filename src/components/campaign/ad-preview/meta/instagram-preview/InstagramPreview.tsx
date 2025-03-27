
import React, { useState, useRef } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { AdTemplate } from "../../template-gallery/TemplateGallery";
import InstagramPreviewHeader from "./InstagramPreviewHeader";
import ImageContent from "./ImageContent";
import TextContent from "./TextContent";
import ActionBar from "./ActionBar";
import InstagramPreviewFooter from "./InstagramPreviewFooter";
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
        return "max-w-[288px] w-full aspect-[9/16] border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-black";
      case "reel":
        return "max-w-[288px] w-full aspect-[4/5] border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-black";
      default: // feed
        return "max-w-[288px] w-full border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800";
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

  return (
    <div className={`${getPreviewClass()} transition-all duration-200 ease-in-out`}>
      <InstagramPreviewHeader companyName={companyName} format={viewMode} />
      
      <ImageContent 
        ad={ad}
        imageKey={index}
        isLoading={isLoading}
        isUploading={isUploading}
        onGenerateImage={onGenerateImage}
        triggerFileUpload={triggerFileUpload}
        format={viewMode}
        onTemplateSelect={handleTemplateSelect}
      />
      
      {viewMode === "feed" && (
        <div className="p-3">
          <ActionBar />
          <TextContent 
            headline={ad.headline}
            primaryText={ad.primaryText}
            companyName={companyName}
          />
          <InstagramPreviewFooter ad={ad} companyName={companyName} />
        </div>
      )}
      
      {viewMode === "story" && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm flex items-center">
            <span className="transform rotate-180">↓</span>
            <span className="ml-2">Swipe Up</span>
          </div>
        </div>
      )}
      
      {viewMode === "reel" && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
          <div className="text-sm font-medium mb-1">{ad.headline}</div>
          <div className="text-xs">{companyName}</div>
          <button className="mt-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-md">
            {ad.description || "Shop Now"}
          </button>
        </div>
      )}
      
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

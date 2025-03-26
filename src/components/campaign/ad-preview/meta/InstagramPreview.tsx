
import React, { useState, useRef } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import InstagramPreviewHeader from "./instagram-preview/InstagramPreviewHeader";
import ImageContent from "./instagram-preview/ImageContent";
import TextContent from "./instagram-preview/TextContent";
import ActionBar from "./instagram-preview/ActionBar";
import InstagramPreviewFooter from "./instagram-preview/InstagramPreviewFooter";
import ImageUploadHandler from "./instagram-preview/ImageUploadHandler";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  index?: number;
  loadingImageIndex?: number | null;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  index = 0,
  loadingImageIndex = null,
  onGenerateImage,
  onUpdateAd,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = loadingImageIndex === index;

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
        imageFile: file
      });

    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900">
      <InstagramPreviewHeader companyName={companyName} />
      
      <ImageContent 
        ad={ad}
        imageKey={index}
        isLoading={isLoading}
        isUploading={isUploading}
        onGenerateImage={onGenerateImage}
        triggerFileUpload={triggerFileUpload}
        format={ad.format || "feed"}
      />
      
      <div className="p-3">
        <ActionBar />
        <TextContent 
          headline={ad.headline || ""} 
          primaryText={ad.primaryText || ""}
          companyName={companyName}
        />
        <InstagramPreviewFooter />
      </div>
      
      <ImageUploadHandler 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default InstagramPreview;

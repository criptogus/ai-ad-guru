
import React, { useState, useRef } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { cn, normalizeMetaAd } from "@/lib/utils";
import ImageDisplay from "./ImageDisplay";
import ContentSection from "./ContentSection";
import InstagramPreviewFooter from "./InstagramPreviewFooter";
import ImageUploadHandler from "./ImageUploadHandler";
import { toast } from "sonner";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  isGeneratingImage?: boolean;
  loadingImageIndex?: number | null;
  index?: number;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  viewMode?: "feed" | "story" | "reel";
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  isGeneratingImage = false,
  loadingImageIndex = null,
  index = 0,
  onGenerateImage,
  onUpdateAd,
  viewMode = "feed"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = loadingImageIndex === index;
  
  // Normalize the ad to ensure it has format and hashtags properties
  const normalizedAd = normalizeMetaAd(ad);

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

  // Determine which format to use (from props, ad, or default)
  const format = viewMode 
    ? viewMode 
    : normalizeFormat(normalizedAd.format);

  return (
    <div className="w-full max-w-sm mx-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2">
            {/* Placeholder for profile image */}
          </div>
          <div className="font-semibold">{companyName}</div>
        </div>
        <div>...</div>
      </div>

      {/* Image Section */}
      <div className="aspect-w-1 aspect-h-1">
        <ImageDisplay
          imageUrl={normalizedAd.imageUrl || ""}
          alt={normalizedAd.headline}
          onGenerateImage={onGenerateImage}
          isLoading={isLoading}
          imagePrompt={normalizedAd.imagePrompt}
        />
      </div>

      {/* Content Section */}
      <ContentSection ad={normalizedAd} companyName={companyName} />

      {/* Footer Section */}
      <InstagramPreviewFooter ad={normalizedAd} companyName={companyName} />
      
      {/* Image Upload Handler */}
      {fileInputRef && <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />}
    </div>
  );
};

export default InstagramPreview;

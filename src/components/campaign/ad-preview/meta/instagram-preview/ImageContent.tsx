
import React, { useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import ImageDisplay from "./ImageDisplay";
import ImageLoader from "./ImageLoader";
import ImagePlaceholder from "./ImagePlaceholder";
import TemplateGalleryButton from "./TemplateGalleryButton";
import TemplateGallery, { AdTemplate } from "../../template-gallery/TemplateGallery";

interface ImageContentProps {
  ad: MetaAd;
  imageKey?: number;
  isLoading?: boolean;
  isUploading?: boolean;
  onGenerateImage?: () => Promise<void>;
  triggerFileUpload?: () => void;
  format?: string;
  onTemplateSelect?: (template: AdTemplate) => void;
}

const ImageContent: React.FC<ImageContentProps> = ({
  ad,
  imageKey = 0,
  isLoading = false,
  isUploading = false,
  onGenerateImage,
  triggerFileUpload,
  format = "feed",
  onTemplateSelect
}) => {
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  const getClassName = () => {
    switch (format) {
      case "story":
        return "aspect-[9/16] w-full";
      case "portrait":
        return "aspect-[4/5] w-full";
      case "landscape":
        return "aspect-video w-full";
      default: // feed/square
        return "aspect-square w-full";
    }
  };

  const getLoadingItem = () => {
    if (isLoading) {
      return <ImageLoader />;
    }
    
    if (isUploading) {
      return <ImageLoader text="Uploading..." />;
    }
    
    return null;
  };

  const handleTemplateSelect = (template: AdTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
    setShowTemplateGallery(false);
  };

  const loadingItem = getLoadingItem();

  return (
    <div className={`relative bg-gray-100 dark:bg-gray-800 overflow-hidden ${getClassName()}`}>
      {ad.imageUrl ? (
        <ImageDisplay
          src={ad.imageUrl}
          alt={`Ad image ${imageKey}`}
          onGenerateImage={onGenerateImage}
          isLoading={isLoading}
        />
      ) : loadingItem ? (
        loadingItem
      ) : (
        <ImagePlaceholder
          onGenerateImage={onGenerateImage}
          triggerFileUpload={triggerFileUpload}
          isGenerating={isLoading}
        />
      )}
      
      {!isLoading && !isUploading && !ad.imageUrl && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {triggerFileUpload && (
            <button 
              onClick={triggerFileUpload}
              className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <Upload className="h-3 w-3" />
              Upload
            </button>
          )}
          <button 
            onClick={() => setShowTemplateGallery(true)}
            className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ImageIcon className="h-3 w-3" />
            Template
          </button>
        </div>
      )}
      
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleTemplateSelect}
        platform="instagram"
      />
    </div>
  );
};

export default ImageContent;

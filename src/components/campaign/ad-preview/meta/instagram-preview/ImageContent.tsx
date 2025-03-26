
import React, { useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import ImageDisplay from "./ImageDisplay";
import ImageLoader from "./ImageLoader";
import ImagePlaceholder from "./ImagePlaceholder";
import { AdTemplate } from "../../template-gallery/TemplateGallery";

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
      return <ImageLoader viewType={format === "story" ? "story" : format === "reel" ? "reel" : "feed"} text="Generating..." />;
    }
    
    if (isUploading) {
      return <ImageLoader viewType={format === "story" ? "story" : format === "reel" ? "reel" : "feed"} text="Uploading..." />;
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
          imageUrl={ad.imageUrl}
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
          isLoading={isLoading}
          isUploading={isUploading}
          imageError={false}
          format={format}
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
      
      {showTemplateGallery && (
        <div className="absolute inset-0 z-10">
          <div className="w-full h-full bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg w-3/4 h-3/4 overflow-auto">
              <h3 className="text-lg font-medium mb-4">Select Template</h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Template thumbnails would go here */}
                <button
                  className="border p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleTemplateSelect({
                    id: "custom-template",
                    name: "Custom Template",
                    description: "A custom template",
                    prompt: "Create a professional Instagram ad image with bold text overlay",
                    category: "custom",
                    platform: "instagram"
                  })}
                >
                  Custom Template
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowTemplateGallery(false)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageContent;

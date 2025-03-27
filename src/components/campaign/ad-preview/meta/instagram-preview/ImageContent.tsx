
import React, { useState } from "react";
import { Upload, ImageIcon, LayoutTemplate } from "lucide-react";
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
        return "aspect-[9/16] w-full relative";
      case "reel":
        return "aspect-[9/16] w-full relative";
      case "portrait":
        return "aspect-[4/5] w-full relative";
      case "landscape":
        return "aspect-video w-full relative";
      default: // feed/square
        return "aspect-square w-full relative";
    }
  };

  const getLoadingItem = () => {
    if (isLoading) {
      return <ImageLoader viewType={format as any} text="Generating AI image..." />;
    }
    
    if (isUploading) {
      return <ImageLoader viewType={format as any} text="Uploading..." />;
    }
    
    return null;
  };

  const handleTemplateSelect = (template: AdTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
      setShowTemplateGallery(false);
    }
  };

  const loadingItem = getLoadingItem();

  // Sample templates for demonstration
  const templates = [
    {
      id: "lifestyle-template",
      name: "Lifestyle Template",
      description: "Show your product in a real-life context",
      prompt: "A lifestyle image showing a person using a product in a natural setting with soft lighting and trendy decor",
      category: "lifestyle",
      platform: "instagram",
      dimensions: { width: 1080, height: 1080 }
    },
    {
      id: "professional-template",
      name: "Professional Template",
      description: "A clean, corporate-style presentation",
      prompt: "A professional business setting with modern office aesthetics, clean lines, and corporate styling",
      category: "business",
      platform: "instagram",
      dimensions: { width: 1080, height: 1080 }
    },
    {
      id: "product-template",
      name: "Product Showcase",
      description: "Highlight your product features",
      prompt: "A product displayed on clean background with dramatic lighting highlighting its best features",
      category: "product",
      platform: "instagram",
      dimensions: { width: 1080, height: 1080 }
    },
    {
      id: "story-template",
      name: "Story Template",
      description: "Vertical format for Instagram Stories",
      prompt: "A vertically oriented image with vibrant colors and dynamic composition",
      category: "story",
      platform: "instagram",
      dimensions: { width: 1080, height: 1920 }
    }
  ];

  return (
    <div className={`${getClassName()} bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
      {ad.imageUrl ? (
        <ImageDisplay
          imageUrl={ad.imageUrl}
          alt={ad.imagePrompt || `Ad image ${imageKey}`}
          onGenerateImage={onGenerateImage}
          isLoading={isLoading}
          format={format}
          imagePrompt={ad.imagePrompt}
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
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {triggerFileUpload && (
            <button 
              onClick={triggerFileUpload}
              className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Image
            </button>
          )}
          <button 
            onClick={() => setShowTemplateGallery(true)}
            className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            Use Template
          </button>
        </div>
      )}
      
      {/* Improved template gallery */}
      {showTemplateGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">Select Instagram Template</h3>
              <button
                onClick={() => setShowTemplateGallery(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className="border dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowTemplateGallery(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageContent;

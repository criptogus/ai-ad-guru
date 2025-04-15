
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MetaAd } from "@/hooks/adGeneration";
import { RefreshCw, ImageIcon } from "lucide-react";
import LinkedInImagePlaceholder from "./LinkedInImagePlaceholder";
import TemplateGallery, { AdTemplate } from "../template-gallery/TemplateGallery";
import adTemplates, { getTemplatesByPlatform } from "../template-gallery/adTemplateData";
import { toast } from "sonner";

interface LinkedInImageDisplayProps {
  ad: MetaAd;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  format?: string;
  onTemplateSelect?: (template: AdTemplate) => void;
}

const LinkedInImageDisplay: React.FC<LinkedInImageDisplayProps> = ({
  ad,
  isGeneratingImage = false,
  onGenerateImage,
  format = "square",
  onTemplateSelect
}) => {
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const getFormatClass = () => {
    if (format === "landscape") return "aspect-video";
    return "aspect-square"; // default to square
  };

  const handleTemplateSelect = (template: AdTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
    setShowTemplateGallery(false);
  };

  const handleImageError = () => {
    console.error("LinkedIn image failed to load:", ad.imageUrl);
    setImageError(true);
    
    // Retry loading if we have less than 3 attempts
    if (retryCount < 3 && ad.imageUrl) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      
      setTimeout(() => {
        // Force image reload with cache busting
        const img = document.querySelector(`img[src^="${ad.imageUrl}"]`) as HTMLImageElement;
        if (img) {
          const newSrc = `${ad.imageUrl}?retry=${Date.now()}`;
          img.src = newSrc;
        }
        setImageError(false);
      }, 1000 * nextRetry); // Increase delay with each retry
    }
  };

  // Get LinkedIn-specific templates
  const linkedInTemplates = getTemplatesByPlatform("linkedin");

  return (
    <div className="relative">
      <div className={`w-full ${getFormatClass()} bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
        {ad.imageUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={ad.imageUrl} 
              alt="LinkedIn Ad" 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            
            {(imageError && retryCount >= 3) && (
              <div className="absolute inset-0 bg-red-50/20 dark:bg-red-900/20 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-center">
                  <p className="text-sm text-red-500 mb-2">Image failed to load</p>
                  {onGenerateImage && (
                    <Button size="sm" onClick={onGenerateImage}>
                      <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {onGenerateImage && !imageError && (
              <div className="absolute bottom-2 right-2">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
                  onClick={onGenerateImage}
                  disabled={isGeneratingImage}
                >
                  <RefreshCw className={`h-4 w-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <LinkedInImagePlaceholder
            isLoading={isGeneratingImage}
            isGenerating={isGeneratingImage}
            onGenerate={onGenerateImage}
          />
        )}
        
        {!isGeneratingImage && !ad.imageUrl && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            <button 
              onClick={() => setShowTemplateGallery(true)}
              className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <ImageIcon className="h-3 w-3" />
              Choose Template
            </button>
          </div>
        )}
      </div>
      
      <TemplateGallery
        templates={linkedInTemplates}
        onSelect={handleTemplateSelect}
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleTemplateSelect}
        platform="linkedin"
      />
    </div>
  );
};

export default LinkedInImageDisplay;

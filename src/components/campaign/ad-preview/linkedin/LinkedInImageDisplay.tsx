
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MetaAd } from "@/hooks/adGeneration";
import { RefreshCw, ImageIcon } from "lucide-react";
import LinkedInImagePlaceholder from "./LinkedInImagePlaceholder";
import TemplateGallery, { AdTemplate } from "../template-gallery/TemplateGallery";
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

  return (
    <div className="relative">
      <div className={`w-full ${getFormatClass()} bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
        {ad.imageUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={ad.imageUrl} 
              alt="LinkedIn Ad" 
              className="w-full h-full object-cover"
            />
            
            {onGenerateImage && (
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
            isGenerating={isGeneratingImage}
            onGenerateImage={onGenerateImage}
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
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleTemplateSelect}
        platform="linkedin"
      />
    </div>
  );
};

export default LinkedInImageDisplay;

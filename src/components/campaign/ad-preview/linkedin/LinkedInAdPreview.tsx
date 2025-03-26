
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInImageDisplay from "./LinkedInImageDisplay";
import { ThumbsUp, MessageSquare, Repeat2, Send } from "lucide-react";
import { AdTemplate } from "../template-gallery/TemplateGallery";
import { toast } from "sonner";

interface LinkedInAdPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  imageFormat?: string;
  previewType?: "feed" | "sidebar" | "message";
  deviceView?: "desktop" | "mobile";
  onUpdateAd?: (updatedAd: MetaAd) => void;
}

const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage,
  imageFormat = "landscape",
  previewType = "feed",
  deviceView = "desktop",
  onUpdateAd
}) => {
  const companyName = analysisResult.companyName || "Your Company";
  
  const getFormatClass = () => {
    switch (previewType) {
      case "sidebar":
        return "max-w-[240px]";
      case "message":
        return "max-w-[400px]";
      default: // feed
        return "max-w-[550px]";
    }
  };
  
  const getDeviceClass = () => {
    return deviceView === "mobile" ? "text-sm" : "text-base";
  };
  
  const handleTemplateSelect = (template: AdTemplate) => {
    if (!onUpdateAd) return;
    
    // Update the ad with the template information
    onUpdateAd({
      ...ad,
      imagePrompt: template.prompt,
      format: template.dimensions.width > template.dimensions.height ? "landscape" : "square"
    });
    
    // Generate new image based on the template
    if (onGenerateImage) {
      toast.info(`Generating image using "${template.name}" template`);
      onGenerateImage();
    }
  };
  
  return (
    <div className={`w-full ${getFormatClass()} mx-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900 ${getDeviceClass()}`}>
      {/* Header */}
      <div className="p-3 flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold mr-3">
          {companyName.charAt(0)}
        </div>
        <div>
          <div className="font-medium">{companyName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span>Promoted</span>
            <span className="inline-block w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-400"></span>
            <span>Follow</span>
          </div>
        </div>
      </div>
      
      {/* Ad content */}
      <div className="px-3 pb-2">
        <p className="text-sm mb-3">{ad.primaryText}</p>
      </div>
      
      {/* Image */}
      <LinkedInImageDisplay 
        ad={ad}
        isGeneratingImage={isGeneratingImage}
        onGenerateImage={onGenerateImage}
        format={imageFormat}
        onTemplateSelect={handleTemplateSelect}
      />
      
      {/* Headline and description */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-medium">{ad.headline}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ad.description}</p>
      </div>
      
      {/* Action bar */}
      <div className="px-3 pb-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs">Like</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">Comment</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Repeat2 className="w-4 h-4" />
            <span className="text-xs">Repost</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Send className="w-4 h-4" />
            <span className="text-xs">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInAdPreview;

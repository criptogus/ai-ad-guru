
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInImageDisplay from "./LinkedInImageDisplay";
import { ThumbsUp, MessageSquare, Repeat2, Send } from "lucide-react";
import { AdTemplate } from "../template-gallery/TemplateGallery";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
      format: template.dimensions?.width > template.dimensions?.height ? "landscape" : "square"
    });
    
    // Generate new image based on the template
    if (onGenerateImage) {
      toast.info(`Generating image using "${template.name}" template`);
      onGenerateImage();
    }
  };
  
  return (
    <div className={`w-full ${getFormatClass()} mx-auto border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900 shadow-sm ${getDeviceClass()}`}>
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold mr-3">
          {companyName.charAt(0)}
        </div>
        <div>
          <div className="font-medium">{companyName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
            <span>Promoted</span>
            <span className="inline-block w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-400"></span>
            <span>Follow</span>
          </div>
        </div>
      </div>
      
      {/* Ad content */}
      <div className="px-4 py-3">
        <p className="text-sm mb-3">{ad.primaryText || "Connect with our professional services to boost your business growth and achieve measurable results."}</p>
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-base">{ad.headline || "Professional Solutions for Your Business"}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{ad.description || "Learn how our services can help you achieve your goals faster."}</p>
        
        {onGenerateImage && !ad.imageUrl && (
          <Button 
            onClick={onGenerateImage}
            variant="outline" 
            size="sm" 
            className="mt-3"
            disabled={isGeneratingImage}
          >
            {isGeneratingImage ? "Generating..." : "Generate Image"}
          </Button>
        )}
      </div>
      
      {/* Action bar */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-medium">Like</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-medium">Comment</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Repeat2 className="w-4 h-4" />
            <span className="text-xs font-medium">Repost</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <Send className="w-4 h-4" />
            <span className="text-xs font-medium">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInAdPreview;

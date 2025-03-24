
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInImageDisplay from "./LinkedInImageDisplay";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Send } from "lucide-react";

interface LinkedInAdPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
  imageFormat?: string;
  previewType?: "feed" | "sidebar" | "message";
  deviceView?: "desktop" | "mobile";
}

const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage,
  onUploadImage,
  imageFormat = "landscape",
  previewType = "feed",
  deviceView = "desktop"
}) => {
  const companyName = analysisResult?.companyName || "Company Name";
  const callToAction = ad.description || "Learn More";
  
  // Determine the correct layout based on the preview type
  const getPreviewLayout = () => {
    switch(previewType) {
      case "sidebar":
        return "max-w-xs";
      case "message":
        return "max-w-sm";
      case "feed":
      default:
        return deviceView === "mobile" ? "max-w-sm" : "max-w-2xl";
    }
  };

  return (
    <div className={`linkedin-ad-preview ${getPreviewLayout()} mx-auto`}>
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        {/* LinkedIn header */}
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center text-base font-bold">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2">
              <p className="font-medium text-sm">{companyName}</p>
              <div className="flex items-center text-xs text-gray-500">
                <span>Promoted</span>
                <span className="mx-1">•</span>
                <span>{deviceView === "mobile" ? "1d" : "1 day ago"}</span>
              </div>
            </div>
          </div>
          <button className="text-gray-500 hover:bg-gray-100 p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>

        {/* Ad text content before image */}
        {ad.primaryText && (
          <div className="px-3 pt-3 pb-2">
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {ad.primaryText}
            </p>
          </div>
        )}

        {/* Ad image */}
        <LinkedInImageDisplay 
          imageUrl={ad.imageUrl}
          isGeneratingImage={isGeneratingImage}
          onGenerateImage={onGenerateImage}
          onUploadImage={onUploadImage}
          imageFormat={imageFormat}
        />

        {/* Ad content after image */}
        <div className="p-3">
          {ad.headline && (
            <h3 className="font-semibold text-base mb-1 line-clamp-2">{ad.headline}</h3>
          )}
          
          {/* Display URL or website domain */}
          {analysisResult?.websiteUrl && (
            <div className="text-xs text-gray-500 mb-2">
              {(() => {
                try {
                  return new URL(analysisResult.websiteUrl).hostname;
                } catch (e) {
                  return analysisResult.websiteUrl;
                }
              })()}
            </div>
          )}
          
          {/* Call to action button */}
          <Button 
            variant="outline" 
            className="mt-2 h-8 text-sm rounded bg-white hover:bg-gray-50 text-blue-600 border-blue-600 hover:border-blue-700 px-3 py-1"
          >
            {callToAction}
          </Button>
        </div>

        {/* LinkedIn engagement */}
        <div className="px-3 py-2 border-t text-gray-500 grid grid-cols-3 gap-1">
          <button className="flex items-center justify-center gap-1 py-1 rounded hover:bg-gray-100 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs">Like</span>
          </button>
          <button className="flex items-center justify-center gap-1 py-1 rounded hover:bg-gray-100 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">Comment</span>
          </button>
          <button className="flex items-center justify-center gap-1 py-1 rounded hover:bg-gray-100 transition-colors">
            <Send className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>
      
      {/* LinkedIn branding watermark */}
      <div className="flex justify-between items-center mt-1 px-1">
        <div className="text-[10px] text-gray-400">Ad preview</div>
        <div className="text-[10px] text-gray-400">LinkedIn</div>
      </div>
    </div>
  );
};

export default LinkedInAdPreview;

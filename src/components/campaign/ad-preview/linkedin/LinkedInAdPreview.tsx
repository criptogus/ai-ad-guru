
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInImageDisplay from "./LinkedInImageDisplay";
import { useFormContext } from "react-hook-form";

interface LinkedInAdPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  previewType?: "feed" | "spotlight";
  deviceView?: "mobile" | "desktop";
  imageFormat?: "square" | "landscape";
}

const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage,
  onUpdateAd,
  previewType = "feed",
  deviceView = "desktop",
  imageFormat = "square"
}) => {
  const formContext = useFormContext();
  
  // Determine which image format class to use
  const getImageFormat = () => {
    return imageFormat === "landscape" ? "aspect-video" : "aspect-square";
  };

  return (
    <div className={`linkedin-preview bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden ${deviceView === "mobile" ? "max-w-sm mx-auto" : "w-full"}`}>
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
          {analysisResult?.companyName?.substring(0, 1) || "C"}
        </div>
        <div>
          <div className="font-medium text-sm">{analysisResult?.companyName || "Company Name"}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">Sponsored · LinkedIn</div>
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-sm mb-3">{ad.primaryText || "Ad primary text will appear here."}</p>
      </div>
      
      <LinkedInImageDisplay
        ad={ad}
        isGeneratingImage={isGeneratingImage}
        onGenerateImage={onGenerateImage}
        format={imageFormat}
      />
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <h3 className="font-medium text-sm mb-1">{ad.headline || "Ad headline will appear here"}</h3>
        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
          {ad.description || "Call to action"} · {analysisResult?.companyName || "Company Name"}
        </div>
      </div>
      
      <div className="p-3 pt-0 flex justify-around border-t border-gray-100 dark:border-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <span className="i-lucide-thumbs-up h-4 w-4"></span>
          Like
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <span className="i-lucide-message-circle h-4 w-4"></span>
          Comment
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <span className="i-lucide-repeat h-4 w-4"></span>
          Share
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <span className="i-lucide-send h-4 w-4"></span>
          Send
        </div>
      </div>
    </div>
  );
};

export default LinkedInAdPreview;

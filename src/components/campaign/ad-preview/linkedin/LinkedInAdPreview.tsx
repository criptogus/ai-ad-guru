
import React, { useState, useRef } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Clock, Briefcase, Users, ThumbsUp, MessageSquare, Repeat2 } from "lucide-react";
import LinkedInImageContent from "./LinkedInImageContent";

interface LinkedInAdPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  imageFormat?: string;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  previewType?: "feed" | "sidebar" | "message";
  deviceView?: "desktop" | "mobile";
}

const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  analysisResult,
  imageFormat = "landscape",
  isGeneratingImage = false,
  onGenerateImage,
  previewType = "feed",
  deviceView = "desktop"
}) => {
  const companyName = analysisResult.companyName || "Company Name";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle sidebar view (different layout)
  if (previewType === "sidebar") {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden text-left ${deviceView === "mobile" ? "w-full max-w-xs mx-auto" : "w-full max-w-xs"}`}>
        <div className="relative">
          <LinkedInImageContent
            ad={ad}
            isLoading={isGeneratingImage}
            isUploading={isUploading}
            onGenerateImage={onGenerateImage}
            triggerFileUpload={handleFileSelect}
            imageFormat="landscape"
          />
        </div>
        
        <div className="p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ad · {companyName}</p>
          <h3 className="text-sm font-semibold line-clamp-2">{ad.headline || "Your headline here"}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">{ad.primaryText || "Your ad text here"}</p>
          
          <button className="mt-2 text-sm w-full py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
            {ad.callToAction || "Learn More"}
          </button>
        </div>
      </div>
    );
  }
  
  // Handle message view
  if (previewType === "message") {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden text-left ${deviceView === "mobile" ? "w-full max-w-sm mx-auto" : "w-full max-w-md"}`}>
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
            {companyName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium">{companyName}</p>
            <p className="text-xs text-gray-500">Sponsored · LinkedIn Message</p>
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-sm mb-3">{ad.primaryText || "Your message text here"}</p>
          
          <div className="mb-3">
            <LinkedInImageContent
              ad={ad}
              isLoading={isGeneratingImage}
              isUploading={isUploading}
              onGenerateImage={onGenerateImage}
              triggerFileUpload={handleFileSelect}
              imageFormat="landscape"
            />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <h3 className="font-semibold">{ad.headline || "Your headline here"}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ad.description || "Your description here"}</p>
            
            <button className="mt-3 text-sm py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
              {ad.callToAction || "Learn More"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Default: feed view
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden text-left ${deviceView === "mobile" ? "w-full max-w-sm mx-auto" : "w-full max-w-xl"}`}>
      {/* Company header */}
      <div className="p-3 flex items-center">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
          {companyName.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <div className="flex items-center">
            <p className="font-medium">{companyName}</p>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-xs text-gray-500">Sponsored</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Briefcase className="h-3 w-3 mr-1" />
            <span className="mr-2">Technology</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>Now</span>
          </div>
        </div>
      </div>
      
      {/* Ad content */}
      <div className="px-3 pb-2">
        <p className="text-sm mb-3">{ad.primaryText || "Your ad text here"}</p>
      </div>
      
      {/* Ad image */}
      <div className="relative">
        <LinkedInImageContent
          ad={ad}
          isLoading={isGeneratingImage}
          isUploading={isUploading}
          onGenerateImage={onGenerateImage}
          triggerFileUpload={handleFileSelect}
          imageFormat={imageFormat}
        />
      </div>
      
      {/* Ad headline and CTA */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-base leading-tight">{ad.headline || "Your headline here"}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">{ad.description || "Your description here"}</p>
        
        <button className="mt-3 text-sm py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
          {ad.callToAction || "Learn More"}
        </button>
      </div>
      
      {/* Engagement stats */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-gray-500 text-sm">
        <div className="flex items-center">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>24</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>12 comments</span>
          <span>3 shares</span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button className="flex items-center text-gray-500 text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>Like</span>
        </button>
        <button className="flex items-center text-gray-500 text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>Comment</span>
        </button>
        <button className="flex items-center text-gray-500 text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <Repeat2 className="h-4 w-4 mr-1" />
          <span>Share</span>
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png"
        onChange={() => {/* Handle file change here if needed */}}
      />
    </div>
  );
};

export default LinkedInAdPreview;

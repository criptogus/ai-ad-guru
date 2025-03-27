
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MetaAd } from "@/hooks/adGeneration";
import ImageContent from "./ImageContent";
import ContentSection from "./ContentSection";
import HeaderSection from "./HeaderSection";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  index?: number;
  loadingImageIndex?: number | null;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  viewMode?: "feed" | "story" | "reel";
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  index = 0,
  loadingImageIndex = null,
  onGenerateImage,
  onUpdateAd,
  viewMode = "feed"
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isLoading = index === loadingImageIndex;
  
  // Set the container style based on view mode
  const getContainerStyle = () => {
    switch (viewMode) {
      case "story":
        return "w-full max-w-[360px] aspect-[9/16] mx-auto";
      case "reel": 
        return "w-full max-w-[360px] aspect-[9/16] mx-auto";
      default: // feed
        return "w-full max-w-[468px] mx-auto";
    }
  };
  
  // Determine layout style based on view mode
  const getLayoutStyle = () => {
    if (viewMode === "story" || viewMode === "reel") {
      return "flex flex-col h-full";
    }
    return "flex flex-col";
  };
  
  const handleGenerateImage = async (): Promise<void> => {
    if (onGenerateImage) {
      try {
        await onGenerateImage();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <div className={cn(
      "overflow-hidden bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm group",
      getContainerStyle()
    )}>
      <div className={getLayoutStyle()}>
        {/* Header (username, sponsored, etc.) */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <p className="text-sm font-medium">{companyName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sponsored</p>
            </div>
          </div>
          <button className="text-gray-500 dark:text-gray-400">•••</button>
        </div>
        
        {/* Main Content Area */}
        <div className={viewMode === "feed" ? "flex-grow" : "flex-grow relative"}>
          {/* Image is the main content for stories/reels */}
          {(viewMode === "story" || viewMode === "reel") ? (
            <div className="relative h-full">
              <ImageContent 
                ad={ad}
                isLoading={isLoading}
                onGenerateImage={handleGenerateImage}
                format={viewMode}
              />
              
              {/* Overlay text for stories */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <div className="text-sm font-medium mb-1">
                  {ad.headline || companyName}
                </div>
                <div className="text-xs opacity-90">
                  {ad.description || "Learn More"}
                </div>
              </div>
            </div>
          ) : (
            /* Regular feed layout */
            <>
              <ImageContent 
                ad={ad}
                isLoading={isLoading}
                onGenerateImage={handleGenerateImage}
              />
              <div className="p-3">
                {/* Action buttons */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button className="text-gray-800 dark:text-gray-200">♥</button>
                    <button className="text-gray-800 dark:text-gray-200">💬</button>
                    <button className="text-gray-800 dark:text-gray-200">↪</button>
                  </div>
                  <button className="text-gray-800 dark:text-gray-200">🔖</button>
                </div>
                
                {/* Caption */}
                <div className="mb-2 text-sm">
                  <span className="font-medium">{companyName}</span>{" "}
                  <span>{ad.primaryText}</span>
                </div>
                
                {/* Call to action */}
                <div className="mt-3">
                  <button className="text-blue-500 font-medium text-sm">
                    {ad.description || "Learn More"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;

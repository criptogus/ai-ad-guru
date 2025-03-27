
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
      "overflow-hidden bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm",
      getContainerStyle()
    )}>
      <div className={getLayoutStyle()}>
        {/* Header (username, sponsored, etc.) */}
        <HeaderSection companyName={companyName} showMenu={showMenu} setShowMenu={setShowMenu} />
        
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
              <ContentSection 
                ad={ad} 
                companyName={companyName} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;

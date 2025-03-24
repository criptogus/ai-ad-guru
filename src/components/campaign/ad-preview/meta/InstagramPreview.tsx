
import React, { useState, useEffect } from "react";
import { ImageDisplay, ImageLoader, ImagePlaceholder } from "./instagram-preview";
import { Button } from "@/components/ui/button";
import { Image, ImageDown, RotateCcw } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import InstagramPreviewHeader from "./instagram-preview/InstagramPreviewHeader";
import InstagramPreviewFooter from "./instagram-preview/InstagramPreviewFooter";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  loadingImageIndex?: number | null;
  index?: number;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  onUploadImage?: (file: File) => Promise<void>;
  viewType?: "feed" | "story" | "reel";
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  loadingImageIndex = null,
  index = 0,
  onGenerateImage,
  onUpdateAd,
  onUploadImage,
  viewType = "feed"
}) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Determine if this preview is in loading state
  const isLoading = loadingImageIndex === index;

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(prev => !prev);
  };

  // Handle image generation
  const handleGenerateImage = async () => {
    if (onGenerateImage) {
      setIsGenerating(true);
      await onGenerateImage();
      setIsGenerating(false);
    }
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUploadImage) {
      await onUploadImage(e.target.files[0]);
    }
  };

  // Determine dimensions and classes based on view type
  const getViewDimensions = () => {
    switch (viewType) {
      case "story":
      case "reel":
        return "aspect-[9/16] max-w-[320px]";
      case "feed":
      default:
        return "aspect-square max-w-[400px]";
    }
  };

  // Extract hashtags from the text if present
  const extractHashtags = (text?: string) => {
    if (!text) return null;
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.join(' ') : null;
  };

  const hashtags = extractHashtags(ad.primaryText) || extractHashtags(ad.description);

  // Device frame classes based on view type
  const getDeviceFrameClasses = () => {
    if (viewType === "feed") {
      return "rounded-xl border-[10px] border-black shadow-lg";
    } else {
      return "rounded-[40px] border-[12px] border-black shadow-xl";
    }
  };

  return (
    <div className="instagram-preview-container flex flex-col items-center">
      {/* Device frame */}
      <div className={`relative mx-auto ${getDeviceFrameClasses()} overflow-hidden bg-white dark:bg-gray-900`}>
        {/* Status bar - only for stories/reels */}
        {(viewType === "story" || viewType === "reel") && (
          <div className="h-6 w-full bg-black flex justify-between items-center px-4">
            <div className="text-white text-[10px]">9:41</div>
            <div className="flex space-x-1">
              <div className="w-3 h-3">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                </svg>
              </div>
              <div className="w-3 h-3">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M18 9.5a6.5 6.5 0 0 0-13 0v5a6.5 6.5 0 0 0 13 0v-5z" />
                </svg>
              </div>
              <div className="w-3 h-3">
                <svg viewBox="0 0 24 24" fill="white">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <rect x="5" y="10" width="14" height="4" rx="1" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Instagram content container */}
        <div className={`instagram-content bg-white dark:bg-gray-900 flex flex-col ${getViewDimensions()}`}>
          {/* Hide header for stories/reels */}
          {viewType === "feed" && (
            <InstagramPreviewHeader companyName={companyName} />
          )}
          
          {/* Image content */}
          <div 
            className="relative"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {ad.imageUrl ? (
              <ImageDisplay 
                imageUrl={ad.imageUrl} 
                aspectRatio={viewType === "feed" ? "square" : "vertical"}
              />
            ) : isLoading ? (
              <ImageLoader viewType={viewType} />
            ) : (
              <ImagePlaceholder 
                text={ad.imagePrompt || "No image prompt provided"} 
                onClick={handleGenerateImage}
                viewType={viewType}
              />
            )}
            
            {/* Story/reel content overlay */}
            {(viewType === "story" || viewType === "reel") && ad.imageUrl && (
              <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                <div className="mt-8 text-2xl font-bold text-shadow-md">
                  {ad.headline}
                </div>
                <div className="mb-16">
                  <div className="text-shadow-md mb-2">{ad.primaryText}</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                    <span className="text-white font-medium">Learn More</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Image controls overlay (only when hovered and editable) */}
            {isImageHovered && onGenerateImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-2 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white text-gray-800 hover:bg-gray-100"
                  onClick={handleGenerateImage}
                  disabled={isLoading}
                >
                  <Image className="h-4 w-4 mr-2" />
                  {isLoading ? "Generating..." : "Generate Image"}
                </Button>
                
                <label className="cursor-pointer">
                  <div className="bg-white text-gray-800 hover:bg-gray-100 rounded-md px-3 py-1.5 text-sm font-medium flex items-center">
                    <ImageDown className="h-4 w-4 mr-2" />
                    Upload Image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
                
                {ad.imageUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white text-gray-800 hover:bg-gray-100"
                    onClick={() => onUpdateAd && onUpdateAd({ ...ad, imageUrl: "" })}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Hide footer for stories/reels */}
          {viewType === "feed" && (
            <div className="bg-white dark:bg-gray-900 p-3">
              <div className="flex items-center space-x-4 mb-2 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 8.7-8.7a.97.97 0 0 1 1.41 0l6.89 6.89" /><path d="M13 13.8 21 21" /><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
              </div>
              
              <div>
                <span className="font-semibold text-sm dark:text-white">{companyName}</span>
                <span className="text-sm dark:text-gray-200"> {ad.primaryText}</span>
              </div>
              
              {/* Display headline and description */}
              <div className="mt-1 text-sm">
                <span className="font-semibold dark:text-white">{ad.headline}</span>
                {ad.description && (
                  <span className="text-gray-500 dark:text-gray-400"> {ad.description}</span>
                )}
              </div>
              
              {/* Hashtags - Check if we have them before rendering */}
              {hashtags && (
                <div className="mt-1 text-blue-600 dark:text-blue-400">
                  {hashtags}
                </div>
              )}
              
              {/* CTA Button */}
              <div className="mt-2">
                <button className="w-full py-1.5 rounded bg-[#0095f6] text-white font-semibold text-sm">
                  {ad.callToAction || "Learn More"}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Device home indicator */}
        <div className="h-1 w-1/3 bg-black mx-auto rounded-full mt-1"></div>
      </div>
      
      {/* View type selector buttons */}
      {onUpdateAd && (
        <div className="flex justify-center gap-2 mt-4">
          <Button 
            size="sm" 
            variant={viewType === "feed" ? "default" : "outline"}
            className="text-xs"
            onClick={() => onUpdateAd({ ...ad, format: "feed" })}
          >
            Feed
          </Button>
          <Button 
            size="sm" 
            variant={viewType === "story" ? "default" : "outline"}
            className="text-xs"
            onClick={() => onUpdateAd({ ...ad, format: "story" })}
          >
            Story
          </Button>
          <Button 
            size="sm" 
            variant={viewType === "reel" ? "default" : "outline"}
            className="text-xs"
            onClick={() => onUpdateAd({ ...ad, format: "reel" })}
          >
            Reel
          </Button>
        </div>
      )}
      
      {/* Platform indicator */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Instagram {viewType.charAt(0).toUpperCase() + viewType.slice(1)} Preview
      </div>
    </div>
  );
};

export default InstagramPreview;

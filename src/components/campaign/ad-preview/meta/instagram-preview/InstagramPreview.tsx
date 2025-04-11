
import React, { useState, useRef } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { AdTemplate } from "../../template-gallery/TemplateGallery";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeMetaAd } from "@/lib/utils";
import ImageContent from "./ImageContent";
import { toast } from "sonner";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  index?: number;
  loadingImageIndex?: number | null;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  viewMode?: "feed" | "story" | "reel";
  className?: string;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  index = 0,
  loadingImageIndex = null,
  onGenerateImage,
  onUpdateAd,
  viewMode = "feed",
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = loadingImageIndex === index;
  
  // Normalize the ad to ensure it has format and hashtags properties
  const normalizedAd = normalizeMetaAd(ad);

  // Trigger file input dialog
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpdateAd) return;

    try {
      setIsUploading(true);
      
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      
      // Update the ad with the new image URL
      onUpdateAd({
        ...normalizedAd,
        imageUrl: localUrl
      });

    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // Render Instagram story view
  if (viewMode === "story") {
    return (
      <div className={cn("instagram-story-ad w-[375px] h-[667px] relative bg-black overflow-hidden font-sans", className)}>
        <div className="story-header absolute top-0 left-0 right-0 p-4 pb-2 flex justify-between items-center z-10">
          <div className="profile-info flex items-center">
            <div className="profile-picture w-[30px] h-[30px] rounded-full bg-gray-300 border-2 border-white/80 mr-2"></div>
            <div className="username text-white font-semibold text-sm">{companyName}</div>
            <div className="time text-white/80 text-sm ml-1.5">1h</div>
          </div>
          <div className="ad-label bg-black/50 text-white text-xs py-1 px-2 rounded">Sponsored</div>
        </div>
        
        <div className="story-progress-bar absolute top-3 left-4 right-4 flex gap-1 z-10">
          <div className="progress-segment active h-0.5 flex-1 bg-white rounded-sm"></div>
          <div className="progress-segment h-0.5 flex-1 bg-white/35 rounded-sm"></div>
          <div className="progress-segment h-0.5 flex-1 bg-white/35 rounded-sm"></div>
        </div>
        
        <div className="story-content w-full h-full relative">
          {ad.imageUrl ? (
            <img 
              src={ad.imageUrl} 
              alt="Instagram story"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              {isLoading ? (
                <div className="text-white">Generating image...</div>
              ) : (
                <div className="text-white">No image available</div>
              )}
            </div>
          )}
          
          <div className="story-overlay absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <div className="story-caption text-white text-base mb-4 text-shadow max-w-[85%]">
              {ad.primaryText || "Check out our new product! 🔥"}
            </div>
            
            <div className="swipe-up flex flex-col items-center text-white mb-4">
              <div className="swipe-text text-sm font-semibold mb-1">Swipe up</div>
              <div className="swipe-arrow text-2xl animate-bounce">↑</div>
            </div>
          </div>
        </div>
        
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      </div>
    );
  }
  
  // Render Instagram feed post view (default)
  return (
    <div className={cn("instagram-ad max-w-[470px] bg-white border border-gray-200 rounded font-sans", className)}>
      <div className="ad-header flex items-center p-3.5">
        <div className="profile-picture w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
        <div className="profile-info flex-1">
          <div className="username text-sm font-semibold text-gray-900">{companyName}</div>
          <div className="sponsored text-xs text-gray-500 flex justify-between">
            Sponsored <span className="more-options font-bold cursor-pointer">···</span>
          </div>
        </div>
      </div>
      
      <div className="ad-image-container bg-gray-100 flex items-center justify-center w-full">
        {ad.imageUrl ? (
          <img 
            src={ad.imageUrl} 
            alt="Instagram ad"
            className="w-full h-auto"
          />
        ) : (
          <div className="h-[470px] w-full flex items-center justify-center">
            {isLoading ? (
              <div className="text-sm text-gray-500">Generating image...</div>
            ) : (
              <div className="text-sm text-gray-500">No image available</div>
            )}
          </div>
        )}
      </div>
      
      <div className="ad-actions flex justify-between p-2">
        <div className="action-buttons flex">
          <Heart className="h-6 w-6 mr-4 cursor-pointer" />
          <MessageCircle className="h-6 w-6 mr-4 cursor-pointer" />
          <Share className="h-6 w-6 cursor-pointer" />
        </div>
        <Bookmark className="h-6 w-6 cursor-pointer" />
      </div>
      
      <div className="ad-likes px-4 mb-2">
        <p className="text-sm font-semibold text-gray-900">1,234 likes</p>
      </div>
      
      <div className="ad-caption px-4 mb-1 text-sm">
        <span className="username font-semibold text-gray-900">{companyName}</span>
        <span className="caption-text ml-1 text-gray-900">
          {ad.primaryText || "Caption text for your Instagram ad explaining your product or service. Use emojis strategically to draw attention and include relevant hashtags to your niche. ✨ #RelevantHashtag #YourBrand"}
        </span>
      </div>
      
      <div className="ad-comments px-4 text-sm">
        <div className="view-comments text-gray-500 mb-1">View all 24 comments</div>
        <div className="comment">
          <span className="comment-username font-semibold text-gray-900">real_user</span>
          <span className="comment-text ml-1 text-gray-900">Love this product! I want to buy it!</span>
        </div>
      </div>
      
      <div className="ad-time px-4 text-[10px] uppercase tracking-wider text-gray-500 mt-1 mb-4">
        2 hours ago
      </div>
      
      <div className="ad-cta-container px-4 pb-4">
        <Button 
          variant="primary" 
          className="w-full rounded-md bg-[#0095f6] text-white hover:bg-[#0081d6]"
        >
          {ad.description || "Shop Now"}
        </Button>
      </div>
      
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
    </div>
  );
};

export default InstagramPreview;

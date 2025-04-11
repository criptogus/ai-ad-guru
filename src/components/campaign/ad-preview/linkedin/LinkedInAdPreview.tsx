
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";

interface LinkedInAdPreviewProps {
  ad: MetaAd;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  previewType?: "feed" | "message" | "sidebar" | "spotlight";
  imageFormat?: "landscape" | "square";
  className?: string;
}

const LinkedInAdPreview: React.FC<LinkedInAdPreviewProps> = ({
  ad,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage,
  onUpdateAd,
  previewType = "feed",
  imageFormat = "landscape",
  className
}) => {
  const companyName = analysisResult?.companyName || "Your Company";
  
  return (
    <div className={cn("linkedin-ad max-w-[552px] bg-white rounded-lg border border-gray-200 shadow-sm font-sans", className)}>
      <div className="ad-header p-3 flex justify-between items-center border-b border-gray-200">
        <div className="profile-info flex items-center">
          <div className="profile-image w-12 h-12 rounded-full bg-[#0a66c2] mr-3"></div>
          <div>
            <div className="company-name text-sm font-semibold text-gray-900">{companyName}</div>
            <div className="post-meta text-xs text-gray-500">
              Promoted · <span className="follow-button text-[#0a66c2] font-semibold cursor-pointer">Follow</span>
            </div>
          </div>
        </div>
        <div className="action-menu text-xl text-gray-500 cursor-pointer">···</div>
      </div>
      
      <div className="ad-content p-4">
        <div className="ad-text text-sm text-gray-900 mb-3 leading-snug">
          {ad.primaryText || "Transform your daily routine with our innovative solution. Designed for maximum efficiency and built to last."}
        </div>
        
        <div className="ad-media -mx-4 mb-2">
          {ad.imageUrl ? (
            <img 
              src={ad.imageUrl} 
              alt="LinkedIn ad"
              className={cn(
                "w-full", 
                imageFormat === "landscape" ? "aspect-[1200/627]" : "aspect-square"
              )}
            />
          ) : (
            <div 
              className={cn(
                "bg-gray-100 flex items-center justify-center",
                imageFormat === "landscape" ? "aspect-[1200/627]" : "aspect-square"
              )}
            >
              {isGeneratingImage ? (
                <div className="text-sm text-gray-500">Generating image...</div>
              ) : (
                <div className="text-sm text-gray-500">No image available</div>
              )}
            </div>
          )}
        </div>
        
        <div className="ad-social-proof flex justify-between py-2 text-xs text-gray-500 border-b border-gray-200">
          <div className="reactions flex items-center">
            <span className="reaction-icon mr-1">👍</span>
            <span className="reaction-icon mr-1">❤️</span>
            <span className="reaction-count">42</span>
          </div>
          <div className="comments-count">8 comments</div>
        </div>
      </div>
      
      <div className="ad-cta-container px-4 py-3 border-b border-gray-200">
        <Button 
          variant="default" 
          className="w-full rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white"
        >
          {ad.description || "Learn More"}
        </Button>
      </div>
      
      <div className="ad-engagement flex justify-between px-3 py-1">
        <div className="engagement-action flex items-center p-2 text-gray-500 text-sm font-medium cursor-pointer">
          <Heart className="mr-1.5 h-5 w-5" />
          <span>Like</span>
        </div>
        <div className="engagement-action flex items-center p-2 text-gray-500 text-sm font-medium cursor-pointer">
          <MessageCircle className="mr-1.5 h-5 w-5" />
          <span>Comment</span>
        </div>
        <div className="engagement-action flex items-center p-2 text-gray-500 text-sm font-medium cursor-pointer">
          <Share2 className="mr-1.5 h-5 w-5" />
          <span>Share</span>
        </div>
        <div className="engagement-action flex items-center p-2 text-gray-500 text-sm font-medium cursor-pointer">
          <Send className="mr-1.5 h-5 w-5" />
          <span>Send</span>
        </div>
      </div>
    </div>
  );
};

export default LinkedInAdPreview;

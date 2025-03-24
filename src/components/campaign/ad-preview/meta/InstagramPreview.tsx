
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ImageContent from "./instagram-preview/ImageContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { Heart, MessageCircle, Send, Bookmark, Camera } from "lucide-react";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  viewType?: "feed" | "story" | "reel";
  loadingImageIndex?: number | null;
  index?: number;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  viewType = "feed",
  loadingImageIndex,
  index,
  onGenerateImage,
  onUpdateAd
}) => {
  const isMobile = useIsMobile();
  const isLoading = loadingImageIndex === index;
  const [isUploading, setIsUploading] = useState(false);
  
  // File upload handling
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Here we would handle file upload to storage
      // For now, we'll just use a local URL
      const imageUrl = URL.createObjectURL(file);
      
      if (onUpdateAd) {
        onUpdateAd({
          ...ad,
          imageUrl
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Device wrapper for mobile-style preview
  const DeviceFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="relative mx-auto">
      <div className="bg-gray-800 rounded-[40px] p-2 mx-auto shadow-lg">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl"></div>
        <div className="border-2 border-gray-600 rounded-[35px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
  
  const StoryView = () => (
    <div className="relative h-[600px] bg-gradient-to-br from-purple-500 to-pink-500">
      {ad.imageUrl ? (
        <img 
          src={ad.imageUrl} 
          alt="Instagram Story" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Button 
            variant="outline" 
            onClick={onGenerateImage}
            className="bg-white/30 backdrop-blur-md border-white text-white hover:bg-white/40"
          >
            <Camera className="mr-2 h-4 w-4" />
            Generate Story Image
          </Button>
        </div>
      )}
      
      {/* Story header */}
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src="" alt={companyName} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {companyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm font-medium text-white drop-shadow-md">{companyName}</span>
          <span className="ml-2 text-xs text-white/80 drop-shadow-md">Sponsored</span>
        </div>
        <div className="text-white">•••</div>
      </div>
      
      {/* CTA at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-full border border-white/30 p-3 text-center text-white font-medium cursor-pointer hover:bg-white/30 transition">
          {ad.description || "Learn More"}
        </div>
      </div>
    </div>
  );
  
  // Default feed view
  const FeedView = () => (
    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden max-w-sm mx-auto">
      {/* Instagram Header */}
      <div className="p-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={companyName} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {companyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-sm font-medium">{companyName}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">Sponsored</div>
          </div>
        </div>
        <span className="text-lg text-gray-500 dark:text-gray-400">•••</span>
      </div>
      
      {/* Image Content */}
      <ImageContent 
        ad={ad}
        imageKey={index}
        isLoading={Boolean(isLoading)}
        isUploading={isUploading}
        onGenerateImage={onGenerateImage}
        triggerFileUpload={triggerFileUpload}
      />
      
      {/* Caption */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Heart className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            <MessageCircle className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            <Send className="h-6 w-6 text-gray-800 dark:text-gray-200" />
          </div>
          <Bookmark className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        </div>
        
        <div className="text-sm font-medium">
          Liked by <span className="font-semibold">instagramuser</span> and <span className="font-semibold">others</span>
        </div>
        
        <div className="text-sm">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{companyName}</span>{" "}
          <span className="text-gray-800 dark:text-gray-200">{ad.primaryText}</span>
          
          {/* Hashtags */}
          {ad.hashtags && (
            <div className="mt-1 text-blue-600 dark:text-blue-400">
              {ad.hashtags}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          View all comments
        </div>
        
        {/* Call to Action */}
        <Button 
          className="w-full py-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
        >
          {ad.description || "Learn More"}
        </Button>
      </div>
      
      {/* Instagram watermark */}
      <div className="flex justify-end p-1 border-t border-gray-100 dark:border-gray-800">
        <div className="text-[10px] text-gray-400">Instagram</div>
      </div>
    </div>
  );
  
  // Reel view
  const ReelView = () => (
    <div className="relative h-[600px] bg-black">
      {ad.imageUrl ? (
        <img 
          src={ad.imageUrl} 
          alt="Instagram Reel" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Button 
            variant="outline" 
            onClick={onGenerateImage}
            className="bg-white/30 backdrop-blur-md border-white text-white hover:bg-white/40"
          >
            <Camera className="mr-2 h-4 w-4" />
            Generate Reel Image
          </Button>
        </div>
      )}
      
      {/* Reel overlay controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-start mb-3">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src="" alt={companyName} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {companyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <div className="text-sm font-medium text-white">{companyName}</div>
            <div className="text-xs text-white/80">Sponsored</div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto border-white text-white hover:bg-white/20 hover:text-white"
          >
            {ad.description || "Learn More"}
          </Button>
        </div>
        
        <div className="text-white text-sm">
          {ad.primaryText}
        </div>
      </div>
      
      {/* Right side controls */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <Heart className="h-7 w-7 text-white mb-1" />
          <span className="text-white text-xs">24.5K</span>
        </div>
        <div className="flex flex-col items-center">
          <MessageCircle className="h-7 w-7 text-white mb-1" />
          <span className="text-white text-xs">1,045</span>
        </div>
        <div className="flex flex-col items-center">
          <Send className="h-7 w-7 text-white mb-1" />
          <span className="text-white text-xs">Share</span>
        </div>
        <div className="flex flex-col items-center">
          <Bookmark className="h-7 w-7 text-white mb-1" />
          <span className="text-white text-xs">Save</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="instagram-preview transition-all duration-300">
      <DeviceFrame>
        {viewType === "story" && <StoryView />}
        {viewType === "feed" && <FeedView />}
        {viewType === "reel" && <ReelView />}
      </DeviceFrame>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default InstagramPreview;

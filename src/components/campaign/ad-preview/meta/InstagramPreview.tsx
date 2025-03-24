
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageContent from "./instagram-preview/ImageContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface InstagramPreviewProps {
  ad: MetaAd;
  companyName: string;
  loadingImageIndex?: number | null;
  index?: number;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  ad,
  companyName,
  loadingImageIndex,
  index,
  onGenerateImage,
  onUpdateAd
}) => {
  const isMobile = useIsMobile();
  const isLoading = loadingImageIndex === index;
  const [isUploading, setIsUploading] = React.useState(false);
  
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden max-w-sm mx-auto">
      {/* Instagram Header */}
      <div className="p-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="" alt={companyName} />
            <AvatarFallback className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {companyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{companyName}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Ad</span>
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
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-gray-800 dark:text-gray-200">❤️</span>
            <span className="text-gray-800 dark:text-gray-200">💬</span>
            <span className="text-gray-800 dark:text-gray-200">🔄</span>
          </div>
          <span className="text-gray-800 dark:text-gray-200">🔖</span>
        </div>
        
        <div>
          <p className="text-sm">
            <span className="font-semibold text-gray-900 dark:text-gray-100">{companyName}</span>{" "}
            {ad.primaryText}
          </p>
          
          {ad.headline && (
            <p className="text-sm font-medium mt-1 text-gray-900 dark:text-gray-100">
              {ad.headline}
            </p>
          )}
        </div>
        
        {/* Call to Action */}
        <button className="w-full py-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors">
          Learn More
        </button>
      </div>
      
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

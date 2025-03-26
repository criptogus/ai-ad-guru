
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ImageDisplayProps {
  imageUrl?: string;
  alt?: string;
  onGenerateImage?: () => Promise<void>;
  isLoading?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageUrl,
  alt = "Instagram ad",
  onGenerateImage,
  isLoading = false 
}) => {
  return (
    <div className="w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {onGenerateImage && (
        <div className="absolute bottom-2 right-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
            onClick={onGenerateImage}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;

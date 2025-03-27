
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ImageDisplayProps {
  imageUrl?: string;
  alt?: string;
  onGenerateImage?: () => Promise<void>;
  isLoading?: boolean;
  format?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageUrl,
  alt = "Instagram ad",
  onGenerateImage,
  isLoading = false,
  format = "feed"
}) => {
  // Determine the best object-fit style based on format
  const getObjectFitStyle = () => {
    switch (format) {
      case "story":
      case "reel":
        return "object-cover";
      default:
        return "object-cover";
    }
  };

  return (
    <div className={`w-full h-full relative overflow-hidden bg-gray-100 dark:bg-gray-800`}>
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full ${getObjectFitStyle()}`}
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


import React from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface ImagePlaceholderProps {
  hasPrompt?: boolean;
  onGenerateImage?: () => Promise<void>;
  text?: string;
  format?: "feed" | "story" | "reel";
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  hasPrompt = false,
  onGenerateImage,
  text = "No image available",
  format = "feed"
}) => {
  // Apply different aspect ratios based on format
  const aspectRatioClass = format === "feed" 
    ? "aspect-square" 
    : "aspect-[9/16]";
  
  return (
    <div className={`w-full ${aspectRatioClass} bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4`}>
      <Image className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">{text}</p>
      
      {hasPrompt && onGenerateImage && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onGenerateImage}
        >
          Generate Image
        </Button>
      )}
    </div>
  );
};

export default ImagePlaceholder;


import React from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  format: "feed" | "story" | "reel";
  prompt?: string;
  onGenerateImage?: () => void;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  format, 
  prompt,
  onGenerateImage 
}) => {
  // Get container class based on format
  const getContainerClass = () => {
    if (format === "story" || format === "reel") {
      return "h-full";
    }
    return "aspect-square";
  };

  return (
    <div className={`${getContainerClass()} flex flex-col items-center justify-center p-4 text-center`}>
      <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 mb-2">No image generated yet</p>
      
      {prompt && (
        <p className="text-xs text-gray-400 mb-4 max-w-[80%] truncate">
          Prompt: {prompt}
        </p>
      )}
      
      {onGenerateImage && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onGenerateImage}
          className="mt-2"
        >
          Generate Image
        </Button>
      )}
    </div>
  );
};

export default ImagePlaceholder;

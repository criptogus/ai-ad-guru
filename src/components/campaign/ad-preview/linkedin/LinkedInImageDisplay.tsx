
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image } from "lucide-react";

interface LinkedInImageDisplayProps {
  imageUrl?: string;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  imageFormat?: string;
}

const LinkedInImageDisplay: React.FC<LinkedInImageDisplayProps> = ({
  imageUrl,
  isGeneratingImage = false,
  onGenerateImage,
  imageFormat = "square"
}) => {
  // Set dimensions based on format (square or landscape)
  const imageClass = imageFormat === "square" 
    ? "aspect-square w-full object-cover" 
    : "aspect-[1200/627] w-full object-cover";

  if (isGeneratingImage) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${imageClass}`}>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Generating image...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl && onGenerateImage) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${imageClass}`}>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Image className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No image generated yet</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={onGenerateImage}
          >
            Generate Image
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="LinkedIn Ad" 
          className={imageClass} 
        />
      ) : (
        <div className={`bg-gray-100 flex items-center justify-center ${imageClass}`}>
          <Image className="h-10 w-10 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default LinkedInImageDisplay;

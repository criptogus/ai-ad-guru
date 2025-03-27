
import React from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface ImageDisplayProps {
  imageUrl: string;
  alt: string;
  onGenerateImage?: () => Promise<void>;
  isLoading?: boolean;
  format?: string;
  imagePrompt?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  alt,
  onGenerateImage,
  isLoading = false,
  format = "feed",
  imagePrompt
}) => {
  const handleRegenerateClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGenerateImage && !isLoading) {
      await onGenerateImage();
    }
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay with image prompt */}
      {imagePrompt && (
        <div className="absolute top-2 left-2 right-2 bg-black/40 backdrop-blur-sm text-white text-xs p-1.5 rounded opacity-70 hover:opacity-100 transition-opacity">
          <p className="line-clamp-2">{imagePrompt}</p>
        </div>
      )}
      
      {onGenerateImage && (
        <button
          onClick={handleRegenerateClick}
          disabled={isLoading}
          className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default ImageDisplay;

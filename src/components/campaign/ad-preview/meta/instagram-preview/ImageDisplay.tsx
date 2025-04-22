
import React from "react";
import { Button } from "@/components/ui/button";

interface ImageDisplayProps {
  imageUrl: string;
  altText: string;
  onGenerateImage?: () => Promise<void>;
  imagePrompt?: string;
  format: "feed" | "story" | "reel";
  onError?: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  altText,
  onGenerateImage,
  imagePrompt,
  format,
  onError
}) => {
  // Try to load a placeholder fallback if the main image fails
  const [fallbackActive, setFallbackActive] = React.useState(false);
  
  // Safely construct a fallback URL with the alt text
  const getFallbackUrl = () => {
    const safeAltText = encodeURIComponent(altText.substring(0, 30) || "Imagem Instagram");
    return `https://placehold.co/600x600?text=${safeAltText}`;
  };
  
  const handleError = () => {
    console.error("Instagram ad image failed to load:", imageUrl);
    
    // Only use fallback for the first error
    if (!fallbackActive) {
      setFallbackActive(true);
      
      // Also call the parent's error handler if provided
      if (onError) {
        onError();
      }
    }
  };
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <img
        src={fallbackActive ? getFallbackUrl() : imageUrl}
        alt={altText}
        className={`object-cover rounded-lg shadow w-full h-auto ${format === "feed" ? "aspect-square" : "aspect-[9/16]"} max-h-96 border`}
        onError={handleError}
      />
      {onGenerateImage && (
        <Button
          variant="ghost"
          className="absolute top-2 right-2"
          onClick={onGenerateImage}
          size="sm"
        >
          Gerar nova imagem
        </Button>
      )}
      {imagePrompt && (
        <div className="mt-2 text-xs text-muted-foreground text-center w-full max-w-sm truncate">
          <span className="font-semibold">Prompt:</span> {imagePrompt}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;

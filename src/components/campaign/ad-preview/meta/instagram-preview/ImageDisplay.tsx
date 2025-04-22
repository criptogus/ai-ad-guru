
import React from "react";
import { Button } from "@/components/ui/button";

interface ImageDisplayProps {
  imageUrl: string;
  altText: string;
  onGenerateImage?: () => Promise<void>;
  imagePrompt?: string;
  format: "feed" | "story" | "reel";
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  altText,
  onGenerateImage,
  imagePrompt,
  format
}) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <img
        src={imageUrl}
        alt={altText}
        className={`object-cover rounded-lg shadow w-full h-auto ${format === "feed" ? "aspect-square" : "aspect-[9/16]"} max-h-96 border`}
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

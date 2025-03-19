
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageDisplayProps {
  imageSrc: string | null;
  altText: string;
  imageKey?: number;
  retryCount: number;
  onImageLoad: () => void;
  onImageError: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageSrc,
  altText,
  imageKey,
  retryCount,
  onImageLoad,
  onImageError
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    console.log("The generated image URL loaded successfully");
    setIsImageLoaded(true);
    onImageLoad();
  };

  return (
    <div className="w-full h-full relative">
      {!isImageLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>}
      <img 
        ref={imgRef}
        key={`img-${imageKey || 0}-${retryCount}`}
        src={imageSrc || ''}
        alt={altText}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isImageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleLoad}
        onError={onImageError}
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default ImageDisplay;

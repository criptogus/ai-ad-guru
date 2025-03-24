
import React from "react";

interface ImageLoaderProps {
  imageSrc: string;
  altText: string;
  imageKey?: number;
  retryCount: number;
  onImageLoad: () => void;
  onImageError: () => void;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  imageSrc,
  altText,
  imageKey,
  retryCount,
  onImageLoad,
  onImageError
}) => {
  // We use the key prop to force react to create a new image element when the URL changes
  // This ensures that the onLoad and onError events are properly triggered
  const uniqueKey = `img-${imageKey || 0}-${retryCount}-${Date.now()}`;
  
  return (
    <img
      key={uniqueKey}
      src={imageSrc}
      alt={altText}
      className="w-full h-full object-cover"
      onLoad={onImageLoad}
      onError={onImageError}
    />
  );
};

export default ImageLoader;


import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full absolute" />
          <span className="z-10 text-xs text-gray-500">Loading image...</span>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={altText}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        key={`${imageKey}-${retryCount}`}
        onLoad={() => {
          setLoading(false);
          onImageLoad();
        }}
        onError={onImageError}
      />
    </div>
  );
};

export default ImageLoader;

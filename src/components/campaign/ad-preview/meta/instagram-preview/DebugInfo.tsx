
import React from "react";

interface DebugInfoProps {
  imageUrl: string | undefined;
  isImageLoaded: boolean;
  imageError: boolean;
  retryCount: number;
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  imageUrl,
  isImageLoaded,
  imageError,
  retryCount
}) => {
  // Only show debug info in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-50 text-xs text-white">
      <div className="truncate">
        URL: {imageUrl ? (imageUrl.length > 30 ? imageUrl.substring(0, 30) + '...' : imageUrl) : 'None'}
      </div>
      <div className="flex justify-between">
        <span>Status: {isImageLoaded ? 'Loaded' : imageError ? 'Error' : 'Loading'}</span>
        <span>Retries: {retryCount}/3</span>
      </div>
    </div>
  );
};

export default DebugInfo;

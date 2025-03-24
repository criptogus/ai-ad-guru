
import React from "react";

export interface ImageDisplayProps {
  imageUrl: string;
  aspectRatio: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, aspectRatio }) => {
  return (
    <div className="w-full overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ aspectRatio }}>
      <img
        src={imageUrl}
        alt="Instagram ad"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageDisplay;
